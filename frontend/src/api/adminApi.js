import axiosClient from './axiosClient.js';

/**
 * Admin Governance & Platform Operations API Service
 * Maps to /api/v1/admin/* (Admin Protected)
 */
export const adminApi = {
  /**
   * Get platform overview KPIs and statistics (Admin only).
   * @returns {Promise<object>} Response envelope { success, message, data: { revenue, orders, users, markets, products, reviews, inquiries, top_farmers } }
   */
  getOverviewStats: () => {
    return axiosClient.get('/admin/stats/overview');
  },

  /**
   * List all platform users with filtering and search (Admin only).
   * @param {object} [params] - Query parameters { role, status, search }
   * @returns {Promise<object>} Response envelope { success, message, data: [UserResource, ...] }
   */
  getUsers: (params = {}) => {
    return axiosClient.get('/admin/users', { params });
  },

  /**
   * Update account status of a user (Admin only).
   * @param {number|string} id - User ID
   * @param {string|object} statusOrPayload - 'active'|'banned'|'pending'|'inactive' or object { status }
   * @returns {Promise<object>} Response envelope { success, message, data: UserResource }
   */
  updateUserStatus: (id, statusOrPayload) => {
    const payload = typeof statusOrPayload === 'object'
      ? statusOrPayload
      : { status: statusOrPayload };
    return axiosClient.patch(`/admin/users/${id}/status`, payload);
  },

  /**
   * List pending farmer applications awaiting approval (Admin only).
   * @returns {Promise<object>} Response envelope { success, message, data: [FarmerResource, ...] }
   */
  getPendingFarmers: () => {
    return axiosClient.get('/admin/farmers/pending');
  },

  /**
   * Approve a pending farmer stall application (Admin only).
   * @param {number|string} id - Farmer ID
   * @returns {Promise<object>} Response envelope { success, message, data: FarmerResource }
   */
  approveFarmer: (id) => {
    return axiosClient.patch(`/admin/farmers/${id}/approve`);
  },

  /**
   * Reject a pending farmer stall application with mandatory reason (Admin only).
   * @param {number|string} id - Farmer ID
   * @param {string|object} reasonOrPayload - Rejection reason string or object { reason }
   * @returns {Promise<object>} Response envelope { success, message, data: FarmerResource }
   */
  rejectFarmer: (id, reasonOrPayload) => {
    const payload = typeof reasonOrPayload === 'object'
      ? reasonOrPayload
      : { reason: reasonOrPayload };
    return axiosClient.patch(`/admin/farmers/${id}/reject`, payload);
  },

  /**
   * List contact inquiries sent by visitors (Admin only).
   * @param {object} [params] - Query parameters { is_read, search }
   * @returns {Promise<object>} Response envelope { success, message, data: [ContactMessageResource, ...] }
   */
  getInquiries: (params = {}) => {
    return axiosClient.get('/admin/inquiries', { params });
  },

  /**
   * Mark an inquiry as handled / read (Admin only).
   * @param {number|string} id - Contact Message ID
   * @returns {Promise<object>} Response envelope { success, message, data: ContactMessageResource }
   */
  markInquiryRead: (id) => {
    return axiosClient.patch(`/admin/inquiries/${id}/read`);
  },
};

export default adminApi;
