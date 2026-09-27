import axiosClient from './axiosClient.js';

/**
 * Markets Directory & Operations API Service
 * Maps to /api/v1/markets and /api/v1/admin/markets
 */
export const marketApi = {
  /**
   * List markets with optional filtering and search (Public).
   * @param {object} [params] - Query parameters { search, day_of_week, status }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getMarkets: (params = {}) => {
    return axiosClient.get('/markets', { params });
  },

  /**
   * Get detailed information for a single market including schedules and registered stalls (Public).
   * @param {number|string} id - Market ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getMarket: (id) => {
    return axiosClient.get(`/markets/${id}`);
  },

  /**
   * Create a new farmers market with operating schedules (Admin only).
   * @param {object} data - Market details and schedules array
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  createMarket: (data) => {
    return axiosClient.post('/admin/markets', data);
  },

  /**
   * Update an existing market and its schedules (Admin only).
   * @param {number|string} id - Market ID
   * @param {object} data - Updated market details and schedules
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateMarket: (id, data) => {
    return axiosClient.put(`/admin/markets/${id}`, data);
  },

  /**
   * Delete / soft-delete a market (Admin only).
   * @param {number|string} id - Market ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  deleteMarket: (id) => {
    return axiosClient.delete(`/admin/markets/${id}`);
  },
};

export default marketApi;
