import axiosClient from './axiosClient.js';

/**
 * Pre-Order Lifecycle & Pickup Slots API Service
 * Maps to /api/v1/orders/* and /api/v1/farmer/orders/*
 */
export const orderApi = {
  /**
   * Generate available pickup time slots for a stall at a market on a specific date (Public/Customer).
   * @param {object} params - { farmer_id, market_id, pickup_date: 'YYYY-MM-DD' }
   * @returns {Promise<object>} Response envelope { success, message, data: { slots: [...] } }
   */
  getPickupSlots: (params) => {
    return axiosClient.get('/orders/slots', { params });
  },

  /**
   * Publicly track pre-order status at stall via unique order code (Public).
   * @param {string} orderCode - Unique order code (e.g. 'ORD-...')
   * @returns {Promise<object>} Response envelope { success, message, data: OrderResource }
   */
  trackOrder: (orderCode) => {
    return axiosClient.get(`/orders/track/${encodeURIComponent(orderCode)}`);
  },

  /**
   * Checkout shopping cart into stall-separated pre-orders with slot reservations (Customer only).
   * Cash payment on stall pickup (SRS Zero Online Payment).
   * @param {object} data - Checkout payload { market_id, pickup_date, pickup_slot, notes }
   * @returns {Promise<object>} Response envelope { success, message, data: [OrderResource, ...] }
   */
  checkout: (data) => {
    return axiosClient.post('/orders/checkout', data);
  },

  /**
   * List authenticated customer's pre-orders (Customer only).
   * @param {object} [params] - Query parameters { status }
   * @returns {Promise<object>} Response envelope { success, message, data: [OrderResource, ...] }
   */
  getMyOrders: (params = {}) => {
    return axiosClient.get('/orders/my-orders', { params });
  },

  /**
   * View specific pre-order details for authenticated customer (Customer only).
   * @param {number|string} id - Order ID
   * @returns {Promise<object>} Response envelope { success, message, data: OrderResource }
   */
  getMyOrder: (id) => {
    return axiosClient.get(`/orders/my-orders/${id}`);
  },

  /**
   * Cancel an active pre-order prior to cutoff deadline (Customer only).
   * Restocks produce quantities automatically.
   * @param {number|string} id - Order ID
   * @param {string|object} reasonOrPayload - Cancellation reason string or object { cancel_reason }
   * @returns {Promise<object>} Response envelope { success, message, data: OrderResource }
   */
  cancelOrder: (id, reasonOrPayload = 'Cancelled by customer') => {
    const payload = typeof reasonOrPayload === 'object'
      ? reasonOrPayload
      : { cancel_reason: reasonOrPayload };
    return axiosClient.patch(`/orders/${id}/cancel`, payload);
  },

  /**
   * List incoming pre-orders for the authenticated farmer stall (Farmer only).
   * @param {object} [params] - Query parameters { status, market_id, pickup_date, search }
   * @returns {Promise<object>} Response envelope { success, message, data: [OrderResource, ...] }
   */
  getFarmerOrders: (params = {}) => {
    return axiosClient.get('/farmer/orders', { params });
  },

  /**
   * Accept a pending placed pre-order (Farmer only).
   * State transition: placed -> accepted
   * @param {number|string} id - Order ID
   * @returns {Promise<object>} Response envelope { success, message, data: OrderResource }
   */
  acceptOrder: (id) => {
    return axiosClient.patch(`/farmer/orders/${id}/accept`);
  },

  /**
   * Decline a pre-order with mandatory reason and restock inventory (Farmer only).
   * State transition: placed/accepted -> declined
   * @param {number|string} id - Order ID
   * @param {string|object} reasonOrPayload - Decline reason string or object { cancel_reason }
   * @returns {Promise<object>} Response envelope { success, message, data: OrderResource }
   */
  declineOrder: (id, reasonOrPayload) => {
    const payload = typeof reasonOrPayload === 'object'
      ? reasonOrPayload
      : { cancel_reason: reasonOrPayload };
    return axiosClient.patch(`/farmer/orders/${id}/decline`, payload);
  },

  /**
   * Mark pre-order as packaged and ready for stall pickup (Farmer only).
   * State transition: accepted -> ready_for_pickup
   * @param {number|string} id - Order ID
   * @returns {Promise<object>} Response envelope { success, message, data: OrderResource }
   */
  markOrderReady: (id) => {
    return axiosClient.patch(`/farmer/orders/${id}/ready`);
  },

  /**
   * Complete order when customer collects produce and settles cash at stall (Farmer only).
   * State transition: ready_for_pickup -> completed
   * @param {number|string} id - Order ID
   * @returns {Promise<object>} Response envelope { success, message, data: OrderResource }
   */
  completeOrder: (id) => {
    return axiosClient.patch(`/farmer/orders/${id}/complete`);
  },
};

export default orderApi;
