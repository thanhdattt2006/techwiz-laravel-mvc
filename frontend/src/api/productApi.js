import axiosClient from './axiosClient.js';
import { globalApiCache } from '../utils/apiCache.js';

/**
 * Produce Catalog & Inventory Operations API Service
 * Maps to /api/v1/products, /api/v1/farmer/products, /api/v1/admin/products
 * Uses short TTL cache (30s) and inflight deduplication for fast page navigation.
 */
export const productApi = {
  /**
   * List public products with dynamic multi-criteria filters (Public, Cached 30s).
   * @param {object} [params] - { category_id, market_id, farmer_id, min_price, max_price, in_stock, search, sort_by, limit, page }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getProducts: (params = {}) => {
    const key = `products_${JSON.stringify(params)}`;
    return globalApiCache.fetch(key, () => axiosClient.get('/products', { params }), 30 * 1000);
  },

  /**
   * Get single product details including stall and reviews (Public, Cached 30s).
   * @param {number|string} id - Product ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  getProduct: (id) => {
    return globalApiCache.fetch(`product_${id}`, () => axiosClient.get(`/products/${id}`), 30 * 1000);
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
  createProduct: async (data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await axiosClient.post('/farmer/products', data, config);
    globalApiCache.invalidate('product');
    return res;
  },

  /**
   * Update an existing produce item (Farmer only).
   * If FormData is passed, handles spoofed PUT via _method if needed or PUT directly.
   * @param {number|string} id - Product ID
   * @param {object|FormData} data - Updated details
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  updateProduct: async (id, data) => {
    let res;
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      res = await axiosClient.post(`/farmer/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      res = await axiosClient.put(`/farmer/products/${id}`, data);
    }
    globalApiCache.invalidate('product');
    return res;
  },

  /**
   * Soft delete a produce item (Farmer only).
   * @param {number|string} id - Product ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  deleteProduct: async (id) => {
    const res = await axiosClient.delete(`/farmer/products/${id}`);
    globalApiCache.invalidate('product');
    return res;
  },

  /**
   * Toggle visibility of a produce item for moderation (Admin only).
   * @param {number|string} id - Product ID
   * @returns {Promise<object>} Response envelope { success, message, data: {...} }
   */
  toggleHide: async (id) => {
    const res = await axiosClient.patch(`/admin/products/${id}/toggle-hide`);
    globalApiCache.invalidate('product');
    return res;
  },

  /**
   * List all products including hidden ones for admin moderation (Admin only).
   * @param {object} [params] - Query parameters { is_hidden, search }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getAdminProducts: (params = {}) => {
    return axiosClient.get('/admin/products', { params });
  },
};

export default productApi;
