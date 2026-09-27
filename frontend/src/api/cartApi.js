import axiosClient from './axiosClient.js';

/**
 * Customer Shopping Cart API Service
 * Maps to /api/v1/cart/* (Customer Protected)
 */
export const cartApi = {
  /**
   * Get the authenticated customer's shopping cart grouped by stall (Customer only).
   * @returns {Promise<object>} Response envelope { success, message, data: { id, user_id, items, stalls, grand_total, total_items } }
   */
  getCart: () => {
    return axiosClient.get('/cart');
  },

  /**
   * Add a produce item to the cart with stock validation.
   * @param {number|string|object} productIdOrPayload - Product ID or object { product_id, quantity }
   * @param {number} [quantity=1] - Quantity if first arg is ID
   * @returns {Promise<object>} Response envelope { success, message, data: CartResource }
   */
  addItem: (productIdOrPayload, quantity = 1) => {
    const payload = typeof productIdOrPayload === 'object'
      ? productIdOrPayload
      : { product_id: productIdOrPayload, quantity };
    return axiosClient.post('/cart/items', payload);
  },

  /**
   * Update the quantity of a specific cart item.
   * @param {number|string} id - Cart item ID
   * @param {number|object} quantityOrPayload - New quantity or object { quantity }
   * @returns {Promise<object>} Response envelope { success, message, data: CartResource }
   */
  updateItem: (id, quantityOrPayload) => {
    const payload = typeof quantityOrPayload === 'object'
      ? quantityOrPayload
      : { quantity: quantityOrPayload };
    return axiosClient.put(`/cart/items/${id}`, payload);
  },

  /**
   * Remove a single item from the cart.
   * @param {number|string} id - Cart item ID
   * @returns {Promise<object>} Response envelope { success, message, data: CartResource }
   */
  removeItem: (id) => {
    return axiosClient.delete(`/cart/items/${id}`);
  },

  /**
   * Clear all items from the shopping cart.
   * @returns {Promise<object>} Response envelope { success, message, data: CartResource }
   */
  clearCart: () => {
    return axiosClient.delete('/cart/clear');
  },
};

export default cartApi;
