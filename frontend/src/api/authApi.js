import axiosClient from './axiosClient.js';

/**
 * Authentication & Profile API Service
 * Maps to Laravel /api/v1/auth routes
 */
export const authApi = {
  /**
   * Log in with login credential (email or username) and password.
   * @param {string|object} loginOrCredentials - Username/email or object { login, password }
   * @param {string} [password] - User password if first arg is string
   * @returns {Promise<object>} Response envelope { success, message, data: { user, token } }
   */
  login: (loginOrCredentials, password) => {
    const payload = typeof loginOrCredentials === 'object'
      ? loginOrCredentials
      : { login: loginOrCredentials, password };
    return axiosClient.post('/auth/login', payload);
  },

  /**
   * Register a new customer account.
   * Automatically creates an active customer account with an empty cart.
   * @param {object} data - { fullname, username, email, phone, address, password, password_confirmation }
   * @returns {Promise<object>} Response envelope { success, message, data: { user, token } }
   */
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  /**
   * Register a new farmer stall application.
   * Creates a farmer user with status 'pending' awaiting admin review.
   * @param {object} data - { fullname, username, email, phone, password, password_confirmation, stall_name, contact_person, contact_phone, address, description, latitude, longitude }
   * @returns {Promise<object>} Response envelope { success, message, data: { user, farmer } }
   */
  registerFarmer: (data) => {
    return axiosClient.post('/auth/register-farmer', data);
  },

  /**
   * Get details of currently authenticated user.
   * @returns {Promise<object>} Response envelope { success, message, data: { user } }
   */
  getMe: () => {
    return axiosClient.get('/auth/me');
  },

  /**
   * Update authenticated user's profile details.
   * @param {object} data - { fullname, phone, address }
   * @returns {Promise<object>} Response envelope { success, message, data: { user } }
   */
  updateProfile: (data) => {
    return axiosClient.put('/auth/profile', data);
  },

  /**
   * Change authenticated user's password.
   * @param {object} data - { current_password, new_password, new_password_confirmation }
   * @returns {Promise<object>} Response envelope { success, message }
   */
  changePassword: (data) => {
    return axiosClient.put('/auth/change-password', data);
  },

  /**
   * Log out and revoke current access token.
   * @returns {Promise<object>} Response envelope { success, message }
   */
  logout: () => {
    return axiosClient.post('/auth/logout');
  },
};

export default authApi;
