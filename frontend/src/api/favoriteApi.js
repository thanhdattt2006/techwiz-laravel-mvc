import axiosClient from './axiosClient.js';

/**
 * Customer Favorites API Service
 * Maps to /api/v1/favorites/* (Customer Protected)
 */
export const favoriteApi = {
  /**
   * List authenticated customer's favorited items (Customer only).
   * @param {object} [params] - Query parameters { type: 'farmer'|'product'|'market' }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getFavorites: (params = {}) => {
    return axiosClient.get('/favorites', { params });
  },

  /**
   * Toggle favorite status on a farmer, product, or market (Customer only).
   * @param {string|object} targetTypeOrPayload - 'farmer'|'product'|'market' or object { favoritable_type, favoritable_id }
   * @param {number|string} [targetId] - Target entity ID if first arg is string
   * @returns {Promise<object>} Response envelope { success, message, data: { is_favorited, favoritable_type, favoritable_id, favorite? } }
   */
  toggleFavorite: (targetTypeOrPayload, targetId) => {
    const payload = typeof targetTypeOrPayload === 'object'
      ? targetTypeOrPayload
      : { favoritable_type: targetTypeOrPayload, favoritable_id: targetId };
    return axiosClient.post('/favorites/toggle', payload);
  },
};

export default favoriteApi;
