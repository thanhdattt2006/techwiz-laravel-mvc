import axiosClient from './axiosClient.js';

/**
 * Notifications & Platform Announcements API Service
 * Maps to /api/v1/notifications/* and /api/v1/announcements/*
 */
export const notificationApi = {
  /**
   * Get authenticated user's in-app notifications with unread count.
   * @param {object} [params] - Query parameters { unread_only }
   * @returns {Promise<object>} Response envelope { success, message, data: { unread_count, total_count, notifications } }
   */
  getNotifications: (params = {}) => {
    return axiosClient.get('/notifications', { params });
  },

  /**
   * Mark a single notification as read.
   * @param {number|string} id - Notification ID
   * @returns {Promise<object>} Response envelope { success, message, data: NotificationResource }
   */
  markRead: (id) => {
    return axiosClient.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark all unread notifications as read.
   * @returns {Promise<object>} Response envelope { success, message }
   */
  markAllRead: () => {
    return axiosClient.patch('/notifications/read-all');
  },

  /**
   * Get active public/role-aware platform announcements.
   * @param {object} [params] - Query parameters { role }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getActiveAnnouncements: (params = {}) => {
    return axiosClient.get('/announcements/active', { params });
  },

  /**
   * List all platform announcements for management (Admin only).
   * @param {object} [params] - Query parameters { is_active, target_role }
   * @returns {Promise<object>} Response envelope { success, message, data: [...] }
   */
  getAdminAnnouncements: (params = {}) => {
    return axiosClient.get('/admin/announcements', { params });
  },

  /**
   * Publish a new platform announcement (Admin only).
   * @param {object} data - { title, content, target_role, is_active }
   * @returns {Promise<object>} Response envelope { success, message, data: AnnouncementResource }
   */
  createAnnouncement: (data) => {
    return axiosClient.post('/admin/announcements', data);
  },

  /**
   * Update an existing platform announcement (Admin only).
   * @param {number|string} id - Announcement ID
   * @param {object} data - Updated announcement details
   * @returns {Promise<object>} Response envelope { success, message, data: AnnouncementResource }
   */
  updateAnnouncement: (id, data) => {
    return axiosClient.put(`/admin/announcements/${id}`, data);
  },

  /**
   * Delete an announcement (Admin only).
   * @param {number|string} id - Announcement ID
   * @returns {Promise<object>} Response envelope { success, message }
   */
  deleteAnnouncement: (id) => {
    return axiosClient.delete(`/admin/announcements/${id}`);
  },
};

export default notificationApi;
