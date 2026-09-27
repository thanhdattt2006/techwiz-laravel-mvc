import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import cartApi from '../api/cartApi.js';
import { useAuth } from './AuthContext.jsx';
import { useModal } from './ModalContext.jsx';

const CartContext = createContext(null);

/**
 * CartProvider
 * Global shopping cart state synchronized with Laravel REST API (/api/v1/cart/*).
 * Automatically groups items by farmer stall and calculates totals.
 */
export function CartProvider({ children }) {
  const { role, isAuthenticated } = useAuth();
  const { showAlert } = useModal();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isCustomer = isAuthenticated && (role === 'customer' || role === 'user');

  // Fetch customer cart from backend
  const refreshCart = useCallback(async () => {
    if (!isCustomer) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const res = await cartApi.getCart();
      const cartData = res?.data?.data || res?.data || null;
      setCart(cartData);
    } catch {
      // Graceful fallback on initial cart fetch error
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  // Synchronize cart on authentication/role changes
  useEffect(() => {
    if (isCustomer) {
      refreshCart();
    } else {
      setCart(null);
      setIsOpen(false);
    }
  }, [isCustomer, refreshCart]);

  // Drawer toggles
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  // Add Item to Cart
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        showAlert({
          title: 'Sign In Required',
          message: 'Please sign in to reserve fresh farm produce in your market basket.',
          type: 'info',
          confirmText: 'Sign In',
        });
        return false;
      }

      if (!isCustomer) {
        showAlert({
          title: 'Customer Role Required',
          message: 'Only customer accounts can pre-order produce and add items to a shopping cart.',
          type: 'warning',
        });
        return false;
      }

      try {
        setLoading(true);
        const res = await cartApi.addItem(productId, quantity);
        const updatedCart = res?.data?.data || res?.data;
        if (updatedCart) {
          setCart(updatedCart);
        } else {
          await refreshCart();
        }
        return true;
      } catch (err) {
        const errorMsg =
          err?.response?.data?.message || 'Could not add item to basket. Please try again.';
        showAlert({
          title: 'Basket Update Failed',
          message: errorMsg,
          type: 'danger',
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, isCustomer, refreshCart, showAlert]
  );

  // Remove Single Item
  const removeItem = useCallback(
    async (itemId) => {
      if (!isCustomer) return false;

      try {
        setLoading(true);
        const res = await cartApi.removeItem(itemId);
        const updatedCart = res?.data?.data || res?.data;
        if (updatedCart) {
          setCart(updatedCart);
        } else {
          await refreshCart();
        }
        return true;
      } catch (err) {
        const msg = err?.response?.data?.message || 'Could not remove item from basket.';
        showAlert({
          title: 'Remove Failed',
          message: msg,
          type: 'danger',
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isCustomer, refreshCart, showAlert]
  );

  // Update Item Quantity
  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      if (!isCustomer) return false;

      if (quantity <= 0) {
        return removeItem(itemId);
      }

      try {
        setLoading(true);
        const res = await cartApi.updateItem(itemId, quantity);
        const updatedCart = res?.data?.data || res?.data;
        if (updatedCart) {
          setCart(updatedCart);
        } else {
          await refreshCart();
        }
        return true;
      } catch (err) {
        const msg = err?.response?.data?.message || 'Could not update item quantity.';
        showAlert({
          title: 'Update Failed',
          message: msg,
          type: 'warning',
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isCustomer, refreshCart, removeItem, showAlert]
  );

  // Clear Entire Cart
  const clearCart = useCallback(async () => {
    if (!isCustomer) return false;

    try {
      setLoading(true);
      const res = await cartApi.clearCart();
      const updatedCart = res?.data?.data || res?.data;
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        await refreshCart();
      }
      return true;
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not clear shopping basket.';
      showAlert({
        title: 'Clear Basket Failed',
        message: msg,
        type: 'danger',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isCustomer, refreshCart, showAlert]);

  // Compute total item count from cart stalls or total_items_count
  const cartCount = useMemo(() => {
    if (!cart) return 0;
    if (typeof cart.total_items_count === 'number') {
      return cart.total_items_count;
    }
    if (Array.isArray(cart.stalls)) {
      return cart.stalls.reduce((sum, stall) => sum + (stall.items?.length || 0), 0);
    }
    return 0;
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      loading,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    }),
    [
      cart,
      cartCount,
      loading,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
