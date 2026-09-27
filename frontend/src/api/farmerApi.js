import axiosClient from './axiosClient.js';

/**
 * Farmer Directory & Stall Operations API Service
 * Maps to /api/v1/farmers (Public) and /api/v1/farmer/* (Farmer Protected)
 */
export const farmerApi = {
  /**
   * List all active farmer stalls with optional search, sorting, and market filtering (Public).
   * @param {object} [params] - Query parameters { search, market_id, sort_by }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getFarmers: (params = {}) => {
    return axiosClient.get('/farmers', { params });
  },

  /**
   * Get detailed public information for a single farmer stall (Public).
   * @param {number|string} id - Farmer ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getFarmer: (id) => {
    return axiosClient.get(`/farmers/${id}`);
  },

  /**
   * Get the authenticated farmer's own stall profile (Farmer only).
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getFarmerProfile: () => {
    return axiosClient.get('/farmer/profile');
  },

  /**
   * Update the authenticated farmer's stall profile (Farmer only).
   * @param {object} data - { stall_name, contact_person, contact_phone, address, description, latitude, longitude }
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateFarmerProfile: (data) => {
    return axiosClient.put('/farmer/profile', data);
  },

  /**
   * Get all market participations for the authenticated farmer (Farmer only).
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getFarmerMarkets: () => {
    return axiosClient.get('/farmer/markets');
  },

  /**
   * Register stall to sell at a new farmers market (Farmer only).
   * @param {object} data - { market_id, stall_location, pickup_days, pickup_start_time, pickup_end_time, slot_minutes, cutoff_hours, is_active }
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  linkMarket: (data) => {
    return axiosClient.post('/farmer/markets', data);
  },

  /**
   * Update stall pickup schedule and slot configuration at a specific market (Farmer only).
   * @param {number|string} marketId - Market ID
   * @param {object} data - Updated configuration
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateFarmerMarket: (marketId, data) => {
    return axiosClient.put(`/farmer/markets/${marketId}`, data);
  },

  /**
   * Unlink/withdraw the stall from selling at a market (Farmer only).
   * @param {number|string} marketId - Market ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  unlinkMarket: (marketId) => {
    return axiosClient.delete(`/farmer/markets/${marketId}`);
  },
};

export default farmerApi;
