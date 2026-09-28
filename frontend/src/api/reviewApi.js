import axiosClient from './axiosClient.js';

/**
 * Reviews & Feedback API Service
 * Maps to /api/v1/reviews/*, /api/v1/farmer/reviews/*, /api/v1/admin/reviews/*
 */
export const reviewApi = {
  /**
   * Get public customer reviews for a produce item (Public).
   * @param {number|string} productId - Product ID
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getProductReviews: (productId) => {
    return axiosClient.get(`/reviews/product/${productId}`);
  },

  /**
   * Get public customer reviews for a farmer stall (Public).
   * @param {number|string} farmerId - Farmer ID
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getFarmerReviews: (farmerId) => {
    return axiosClient.get(`/reviews/farmer/${farmerId}`);
  },

  /**
   * Submit a rating (1-5 stars) and review for a completed order item or farmer stall (Customer only).
   * @param {object} data - { order_id, rating, comment, product_id, farmer_id }
   * @returns {Promise<object>} Response envelope { success, message, data: ReviewResource }
   */
  submitReview: (data) => {
    return axiosClient.post('/reviews', data);
  },

  /**
   * Respond to a customer review on a produce item (Farmer only).
   * @param {number|string} id - Review ID
   * @param {string|object} replyOrPayload - Reply text string or object { farmer_reply }
   * @returns {Promise<object>} Response envelope { success, message, data: ReviewResource }
   */
  replyReview: (id, replyOrPayload) => {
    const payload = typeof replyOrPayload === 'object'
      ? replyOrPayload
      : { farmer_reply: replyOrPayload };
    return axiosClient.post(`/farmer/reviews/${id}/reply`, payload);
  },

  /**
   * Moderate a review by toggling public visibility (Admin only).
   * @param {number|string} id - Review ID
   * @returns {Promise<object>} Response envelope { success, message, data: ReviewResource }
   */
  toggleHideReview: (id) => {
    return axiosClient.patch(`/admin/reviews/${id}/toggle-hide`);
  },

  /**
   * List all reviews with moderation details (Admin only).
   * @param {object} [params] - Query parameters { is_hidden, rating, search }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getAdminReviews: (params = {}) => {
    return axiosClient.get('/admin/reviews', { params });
  },
};

export default reviewApi;
