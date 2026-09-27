import axiosClient from './axiosClient.js';

/**
 * Weekly Stock Rollover & Periodic Template API Service
 * Maps to /api/v1/farmer/products/{id}/template and /api/v1/farmer/apply-weekly-templates
 */
export const weeklyStockApi = {
  /**
   * Get weekly stock templates for a specific product (Farmer only).
   * @param {number|string} productId - Product ID
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getTemplates: (productId) => {
    return axiosClient.get(`/farmer/products/${productId}/template`);
  },

  /**
   * Configure recurring weekly stock templates for a product (Farmer only).
   * @param {number|string} productId - Product ID
   * @param {array|object} templatesOrPayload - Array of [{ day_of_week, default_quantity, is_active }] or object { templates: [...] }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  updateTemplates: (productId, templatesOrPayload) => {
    const payload = Array.isArray(templatesOrPayload)
      ? { templates: templatesOrPayload }
      : templatesOrPayload;
    return axiosClient.put(`/farmer/products/${productId}/template`, payload);
  },

  /**
   * 1-Click apply weekly stock templates for the upcoming market session (Farmer only).
   * Updates product stock_quantity and availability in bulk based on recurring templates.
   * @param {object} [data] - Optional { target_day, target_date }
   * @returns {Promise<object>} Response envelope { success, message, data: { target_day_of_week, day_name, updated_products_count, products } }
   */
  applyWeeklyTemplates: (data = {}) => {
    return axiosClient.post('/farmer/apply-weekly-templates', data);
  },
};

export default weeklyStockApi;
