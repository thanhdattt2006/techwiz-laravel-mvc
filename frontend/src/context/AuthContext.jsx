import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync token from localStorage or API
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      if (response && response.success && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      }
    } catch {
      // If token expired or invalid, clear state
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for global 401 Unauthorized event from axiosClient
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [checkAuth]);

  /**
   * Log in using either username or email (Gmail) + password.
   */
  const login = async (loginInput, password) => {
    try {
      const response = await authApi.login(loginInput, password);
      if (response && response.success && response.data) {
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Unable to connect to API server.';
      const errors = error.response?.data?.errors || null;
      return { success: false, message, errors };
    }
  };

  /**
   * Quick 1-click Demo Login for 3 roles: admin, operator, user.
   */
  const quickDemoLogin = async (targetRole) => {
    const credentials = {
      admin: { login: 'admin@gmail.com', password: 'password123' },
      operator: { login: 'operator@gmail.com', password: 'password123' },
      user: { login: 'user@gmail.com', password: 'password123' },
    };

    const cred = credentials[targetRole];
    if (!cred) return { success: false, message: 'Role does not exist' };

    return login(cred.login, cred.password);
  };

  /**
   * Log out and revoke access token.
   */
  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch {
      // Ignore API logout errors during client cleanup
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
    quickDemoLogin,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
