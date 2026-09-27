import axiosClient from './axiosClient.js';

/**
 * Produce Categories API Service
 * Maps to /api/v1/categories and /api/v1/admin/categories
 */
export const categoryApi = {
  /**
   * List all categories with active product counts (Public).
   * @param {object} [params] - Optional { status } for admin
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getCategories: (params = {}) => {
    return axiosClient.get('/categories', { params });
  },

  /**
   * Get single category details (Public).
   * @param {number|string} id - Category ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getCategory: (id) => {
    return axiosClient.get(`/categories/${id}`);
  },

  /**
   * Store a new produce category (Admin only).
   * @param {object} data - { name, slug, description, image, is_active }
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  createCategory: (data) => {
    return axiosClient.post('/admin/categories', data);
  },

  /**
   * Update an existing category (Admin only).
   * @param {number|string} id - Category ID
   * @param {object} data - Updated details
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateCategory: (id, data) => {
    return axiosClient.put(`/admin/categories/${id}`, data);
  },

  /**
   * Delete a category (Admin only).
   * Note: Backend returns 422 if category still has associated products.
   * @param {number|string} id - Category ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  deleteCategory: (id) => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },
};

export default categoryApi;
