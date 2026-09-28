import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useModal } from './ModalContext.jsx';
import {
  fetchCartData, addItemToCart, removeCartItem, updateCartItem, clearAllCartItems,
} from '../utils/cartActions.js';

const CartContext = createContext(null);

/**
 * CartProvider
 * Global shopping cart state synchronized with Laravel REST API (/api/v1/cart/*).
 * Cart mutation logic delegated to utils/cartActions.js for SRP compliance.
 */
export function CartProvider({ children }) {
  const { role, isAuthenticated } = useAuth();
  const { showAlert, showConfirm } = useModal();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStall, setCheckoutStall] = useState(null);

  const isCustomer = isAuthenticated && (role === 'customer' || role === 'user');

  const refreshCart = useCallback(async () => {
    if (!isCustomer) { setCart(null); return; }
    try {
      setLoading(true);
      setCart(await fetchCartData());
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    if (isCustomer) { refreshCart(); }
    else { setCart(null); setIsOpen(false); setIsCheckoutOpen(false); setCheckoutStall(null); }
  }, [isCustomer, refreshCart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);
  const openCheckout = useCallback((stall = null) => { setCheckoutStall(stall); setIsCheckoutOpen(true); }, []);
  const closeCheckout = useCallback(() => { setIsCheckoutOpen(false); setCheckoutStall(null); }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      const confirmed = await showConfirm({
        title: 'Sign In Required',
        message: 'Please sign in to reserve fresh farm produce in your market basket.',
        type: 'info',
        confirmText: 'Sign In Now',
        cancelText: 'Stay as Guest',
      });
      if (confirmed) {
        window.location.href = '/login';
      }
      return false;
    }
    if (!isCustomer) {
      showAlert({ title: 'Customer Role Required', message: 'Only customer accounts can pre-order produce and add items to a shopping cart.', type: 'warning' });
      return false;
    }
    try {
      setLoading(true);
      const updated = await addItemToCart(productId, quantity);
      if (updated) setCart(updated); else await refreshCart();
      return true;
    } catch (err) {
      showAlert({ title: 'Basket Update Failed', message: err?.response?.data?.message || 'Could not add item to basket. Please try again.', type: 'danger' });
      return false;
    } finally { setLoading(false); }
  }, [isAuthenticated, isCustomer, refreshCart, showAlert, showConfirm]);

  const removeItem = useCallback(async (itemId) => {
    if (!isCustomer) return false;
    try {
      setLoading(true);
      const updated = await removeCartItem(itemId);
      if (updated) setCart(updated); else await refreshCart();
      return true;
    } catch (err) {
      showAlert({ title: 'Remove Failed', message: err?.response?.data?.message || 'Could not remove item from basket.', type: 'danger' });
      return false;
    } finally { setLoading(false); }
  }, [isCustomer, refreshCart, showAlert]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (!isCustomer) return false;
    if (quantity <= 0) return removeItem(itemId);
    try {
      setLoading(true);
      const updated = await updateCartItem(itemId, quantity);
      if (updated) setCart(updated); else await refreshCart();
      return true;
    } catch (err) {
      showAlert({ title: 'Update Failed', message: err?.response?.data?.message || 'Could not update item quantity.', type: 'warning' });
      return false;
    } finally { setLoading(false); }
  }, [isCustomer, refreshCart, removeItem, showAlert]);

  const clearCart = useCallback(async () => {
    if (!isCustomer) return false;
    try {
      setLoading(true);
      const updated = await clearAllCartItems();
      if (updated) setCart(updated); else await refreshCart();
      return true;
    } catch (err) {
      showAlert({ title: 'Clear Basket Failed', message: err?.response?.data?.message || 'Could not clear shopping basket.', type: 'danger' });
      return false;
    } finally { setLoading(false); }
  }, [isCustomer, refreshCart, showAlert]);

  const cartCount = useMemo(() => {
    if (!cart) return 0;
    if (typeof cart.total_items_count === 'number') return cart.total_items_count;
    if (Array.isArray(cart.stalls)) return cart.stalls.reduce((sum, stall) => sum + (stall.items?.length || 0), 0);
    return 0;
  }, [cart]);

  const value = useMemo(() => ({
    cart, cartCount, loading, isOpen, openCart, closeCart, toggleCart,
    isCheckoutOpen, checkoutStall, openCheckout, closeCheckout,
    addToCart, updateQuantity, removeItem, clearCart, refreshCart,
  }), [
    cart, cartCount, loading, isOpen, openCart, closeCart, toggleCart,
    isCheckoutOpen, checkoutStall, openCheckout, closeCheckout,
    addToCart, updateQuantity, removeItem, clearCart, refreshCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export default CartContext;
