import cartApi from '../api/cartApi.js';

/**
 * Cart API Action Helpers
 * Extracted from CartContext for SRP. Each function performs a cart mutation
 * and returns the updated cart data or throws on error.
 */

export async function fetchCartData() {
  const res = await cartApi.getCart();
  return res?.data?.data || res?.data || null;
}

export async function addItemToCart(productId, quantity = 1) {
  const res = await cartApi.addItem(productId, quantity);
  return res?.data?.data || res?.data || null;
}

export async function removeCartItem(itemId) {
  const res = await cartApi.removeItem(itemId);
  return res?.data?.data || res?.data || null;
}

export async function updateCartItem(itemId, quantity) {
  const res = await cartApi.updateItem(itemId, quantity);
  return res?.data?.data || res?.data || null;
}

export async function clearAllCartItems() {
  const res = await cartApi.clearCart();
  return res?.data?.data || res?.data || null;
}
