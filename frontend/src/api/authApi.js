import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Log in using either username or email (Gmail) + password.
   * @param {string} login - username or email (e.g. admin@gmail.com)
   * @param {string} password - user password
   */
  login: (login, password) => {
    return axiosClient.post('/auth/login', { login, password });
  },

  /**
   * Get details of currently authenticated user.
   */
  getMe: () => {
    return axiosClient.get('/auth/me');
  },

  /**
   * Log out and revoke current access token.
   */
  logout: () => {
    return axiosClient.post('/auth/logout');
  },
};

export default authApi;
