import axiosClient from './axiosClient.js';
import { globalApiCache } from '../utils/apiCache.js';

/**
 * Produce Categories API Service
 * Maps to /api/v1/categories and /api/v1/admin/categories
 * Uses globalApiCache to prevent redundant backend queries.
 */
export const categoryApi = {
  /**
   * List all categories with active product counts (Public, Cached 5 mins).
   * @param {object} [params] - Optional { status } for admin
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getCategories: (params = {}) => {
    const key = `categories_${JSON.stringify(params)}`;
    return globalApiCache.fetch(key, () => axiosClient.get('/categories', { params }), 5 * 60 * 1000);
  },

  /**
   * Get single category details (Public, Cached 5 mins).
   * @param {number|string} id - Category ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getCategory: (id) => {
    return globalApiCache.fetch(`category_${id}`, () => axiosClient.get(`/categories/${id}`), 5 * 60 * 1000);
  },

  /**
   * Store a new produce category (Admin only).
   * @param {object} data - { name, slug, description, image, is_active }
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  createCategory: async (data) => {
    const res = await axiosClient.post('/admin/categories', data);
    globalApiCache.invalidate('categor');
    return res;
  },

  /**
   * Update an existing category (Admin only).
   * @param {number|string} id - Category ID
   * @param {object} data - Updated details
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateCategory: async (id, data) => {
    const res = await axiosClient.put(`/admin/categories/${id}`, data);
    globalApiCache.invalidate('categor');
    return res;
  },

  /**
   * Delete a category (Admin only).
   * Note: Backend returns 422 if category still has associated products.
   * @param {number|string} id - Category ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  deleteCategory: async (id) => {
    const res = await axiosClient.delete(`/admin/categories/${id}`);
    globalApiCache.invalidate('categor');
    return res;
  },
};

export default categoryApi;
