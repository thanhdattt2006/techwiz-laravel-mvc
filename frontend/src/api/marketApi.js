import axiosClient from './axiosClient.js';
import { globalApiCache } from '../utils/apiCache.js';

/**
 * Markets Directory & Operations API Service
 * Maps to /api/v1/markets and /api/v1/admin/markets
 * Uses globalApiCache to prevent redundant backend queries.
 */
export const marketApi = {
  /**
   * List markets with optional filtering and search (Public, Cached 5 mins).
   * @param {object} [params] - Query parameters { search, day_of_week, status }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getMarkets: (params = {}) => {
    const key = `markets_${JSON.stringify(params)}`;
    return globalApiCache.fetch(key, () => axiosClient.get('/markets', { params }), 5 * 60 * 1000);
  },

  /**
   * Get detailed information for a single market (Public, Cached 5 mins).
   * @param {number|string} id - Market ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getMarket: (id) => {
    return globalApiCache.fetch(`market_${id}`, () => axiosClient.get(`/markets/${id}`), 5 * 60 * 1000);
  },

  /**
   * Create a new farmers market with operating schedules (Admin only).
   * @param {object} data - Market details and schedules array
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  createMarket: async (data) => {
    const res = await axiosClient.post('/admin/markets', data);
    globalApiCache.invalidate('market');
    return res;
  },

  /**
   * Update an existing market and its schedules (Admin only).
   * @param {number|string} id - Market ID
   * @param {object} data - Updated market details and schedules
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateMarket: async (id, data) => {
    const res = await axiosClient.put(`/admin/markets/${id}`, data);
    globalApiCache.invalidate('market');
    return res;
  },

  /**
   * Delete / soft-delete a market (Admin only).
   * @param {number|string} id - Market ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  deleteMarket: async (id) => {
    const res = await axiosClient.delete(`/admin/markets/${id}`);
    globalApiCache.invalidate('market');
    return res;
  },
};

export default marketApi;
