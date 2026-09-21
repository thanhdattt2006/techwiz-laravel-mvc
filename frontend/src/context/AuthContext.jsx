import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

/**
 * Toggle backend connection:
 * - false: 100% standalone client-side mock mode (compliant with SRS evaluation & Vercel deployment)
 * - true: Connects to Laravel Web API endpoints via axiosClient
 */
const USE_BACKEND_API = false;

const DEMO_USERS = {
  admin: {
    id: 1,
    fullname: 'LifeLink Administrator',
    username: 'admin',
    email: 'admin@gmail.com',
    phone: '090-111-2222',
    role: 'admin',
    status: 'active',
  },
  operator: {
    id: 2,
    fullname: 'Emergency Dispatcher',
    username: 'operator',
    email: 'operator@gmail.com',
    phone: '090-333-4444',
    role: 'operator',
    status: 'active',
  },
  user: {
    id: 3,
    fullname: 'Patient Citizen',
    username: 'user',
    email: 'user@gmail.com',
    phone: '090-555-6666',
    role: 'user',
    status: 'active',
  },
};

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

  // Initialize and verify authentication
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    if (USE_BACKEND_API) {
      try {
        const response = await authApi.getMe();
        if (response && response.success && response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        }
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Client-side standalone mode
    try {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch {
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

    if (USE_BACKEND_API) {
      const handleUnauthorized = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      };

      window.addEventListener('auth:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }
  }, [checkAuth]);

  /**
   * Log in via either backend API or client-side mock demo.
   */
  const login = async (loginInput, password) => {
    if (USE_BACKEND_API) {
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
        const message = error.response?.data?.message || 'Unable to connect to API server.';
        return { success: false, message };
      }
    }

    // Client-side standalone authentication
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const normalizedInput = loginInput.trim().toLowerCase();
    let authenticatedUser = null;

    if (normalizedInput === 'admin@gmail.com' || normalizedInput === 'admin') {
      authenticatedUser = DEMO_USERS.admin;
    } else if (normalizedInput === 'operator@gmail.com' || normalizedInput === 'operator') {
      authenticatedUser = DEMO_USERS.operator;
    } else if (normalizedInput === 'user@gmail.com' || normalizedInput === 'user') {
      authenticatedUser = DEMO_USERS.user;
    } else if (loginInput.trim().length > 0) {
      authenticatedUser = {
        id: Date.now(),
        fullname: loginInput.trim(),
        username: loginInput.trim().toLowerCase().replace(/\s+/g, '_'),
        email: loginInput.includes('@') ? loginInput.trim() : `${loginInput.trim().toLowerCase()}@example.com`,
        phone: '090-000-0000',
        role: 'user',
        status: 'active',
      };
    }

    if (!authenticatedUser) {
      setIsLoading(false);
      return { success: false, message: 'Invalid login credentials!' };
    }

    const clientToken = `lifelink-session-${authenticatedUser.role}-${Date.now()}`;
    setToken(clientToken);
    setUser(authenticatedUser);
    localStorage.setItem('auth_token', clientToken);
    localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));
    setIsLoading(false);

    return { success: true, user: authenticatedUser };
  };

  /**
   * 1-Click Instant Demo Login for 3 roles: admin, operator, user.
   */
  const quickDemoLogin = async (targetRole) => {
    if (USE_BACKEND_API) {
      const credentials = {
        admin: { login: 'admin@gmail.com', password: 'password123' },
        operator: { login: 'operator@gmail.com', password: 'password123' },
        user: { login: 'user@gmail.com', password: 'password123' },
      };
      const cred = credentials[targetRole];
      if (!cred) return { success: false, message: 'Role does not exist' };
      return login(cred.login, cred.password);
    }

    const targetUser = DEMO_USERS[targetRole];
    if (!targetUser) {
      return { success: false, message: `Role "${targetRole}" does not exist.` };
    }

    const clientToken = `lifelink-demo-${targetRole}-${Date.now()}`;
    setToken(clientToken);
    setUser(targetUser);
    localStorage.setItem('auth_token', clientToken);
    localStorage.setItem('auth_user', JSON.stringify(targetUser));

    return { success: true, user: targetUser };
  };

  /**
   * Log out and clear session.
   */
  const logout = async () => {
    if (USE_BACKEND_API && token) {
      try {
        await authApi.logout();
      } catch {
        // Ignore API logout errors during client cleanup
      }
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
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
