import axiosClient from './axiosClient.js';

/**
 * Produce Catalog & Inventory Operations API Service
 * Maps to /api/v1/products, /api/v1/farmer/products, /api/v1/admin/products
 */
export const productApi = {
  /**
   * List public products with dynamic multi-criteria filters (Public).
   * @param {object} [params] - { category_id, market_id, farmer_id, min_price, max_price, in_stock, search, sort_by, limit, page }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getProducts: (params = {}) => {
    return axiosClient.get('/products', { params });
  },

  /**
   * Get single product details including stall and reviews (Public).
   * @param {number|string} id - Product ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getProduct: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  /**
   * List products owned by the authenticated farmer (Farmer only).
   * @param {object} [params] - Query parameters { category_id, in_stock, search, sort_by }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getFarmerProducts: (params = {}) => {
    return axiosClient.get('/farmer/products', { params });
  },

  /**
   * Store a new produce item for the farmer's stall (Farmer only).
   * Supports JSON or FormData (for image uploads).
   * @param {object|FormData} data - Product details
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  createProduct: (data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return axiosClient.post('/farmer/products', data, config);
  },

  /**
   * Update an existing produce item (Farmer only).
   * If FormData is passed, handles spoofed PUT via _method if needed or PUT directly.
   * @param {number|string} id - Product ID
   * @param {object|FormData} data - Updated details
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateProduct: (id, data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return axiosClient.post(`/farmer/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosClient.put(`/farmer/products/${id}`, data);
  },

  /**
   * Soft delete a produce item (Farmer only).
   * @param {number|string} id - Product ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  deleteProduct: (id) => {
    return axiosClient.delete(`/farmer/products/${id}`);
  },

  /**
   * Toggle visibility of a produce item for moderation (Admin only).
   * @param {number|string} id - Product ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  toggleHide: (id) => {
    return axiosClient.patch(`/admin/products/${id}/toggle-hide`);
  },
};

export default productApi;
