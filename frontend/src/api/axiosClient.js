import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_API_BASE_URL : null;
  const isBrowser = typeof window !== 'undefined';
  const isRemoteHost = isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  // Prevent accidental localhost leaks when deployed on production domain (e.g. vercel.app)
  if (isRemoteHost) {
    if (!envUrl || envUrl.includes('127.0.0.1') || envUrl.includes('localhost')) {
      return 'https://techwiz-laravel-mvc.onrender.com/api/v1';
    }
    return envUrl;
  }

  // Local development or explicit envUrl
  return envUrl || (import.meta?.env?.PROD ? 'https://techwiz-laravel-mvc.onrender.com/api/v1' : 'http://127.0.0.1:8000/api/v1');
};

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Auto-attach Bearer Token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Data Unwrapping & Global 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      // Dispatch custom event so AuthContext can update state
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
