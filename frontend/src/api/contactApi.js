import axiosClient from './axiosClient.js';

/**
 * Public Contact & Inquiry API Service
 * Maps to /api/v1/contact (Public)
 */
export const contactApi = {
  /**
   * Submit a contact inquiry / feedback message to platform administration (Public).
   * @param {object} data - { name, email, subject, message }
   * @returns {Promise<object>} Response envelope { success, message, data: ContactMessageResource }
   */
  submitContact: (data) => {
    return axiosClient.post('/contact', data);
  },
};

export default contactApi;
