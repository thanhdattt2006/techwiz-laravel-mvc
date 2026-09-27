import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi.js';
import { normalizeRole } from '../utils/roleUtils.js';

const AuthContext = createContext(null);

/**
 * Toggle backend connection:
 * - true: Connects to Laravel RESTful Web API endpoints via axiosClient with Sanctum tokens
 * - false: Standalone client-side mock fallback
 */
const USE_BACKEND_API = true;

const DEMO_USERS = {
  admin: {
    id: 1,
    fullname: 'Platform Administrator',
    username: 'admin',
    email: 'admin@marketlink.com',
    phone: '(312) 555-0100',
    role: 'admin',
    status: 'active',
  },
  farmer: {
    id: 2,
    fullname: 'Arthur Pendelton (Prairie Organic Grove)',
    username: 'farmer',
    email: 'farmer@marketlink.com',
    phone: '(312) 555-4421',
    role: 'farmer',
    status: 'active',
  },
  operator: {
    id: 2,
    fullname: 'Arthur Pendelton (Prairie Organic Grove)',
    username: 'farmer',
    email: 'farmer@marketlink.com',
    phone: '(312) 555-4421',
    role: 'farmer',
    status: 'active',
  },
  customer: {
    id: 3,
    fullname: 'Elena Vance (Local Shopper)',
    username: 'customer',
    email: 'customer@marketlink.com',
    phone: '(312) 555-8819',
    role: 'customer',
    status: 'active',
  },
  user: {
    id: 3,
    fullname: 'Elena Vance (Local Shopper)',
    username: 'customer',
    email: 'customer@marketlink.com',
    phone: '(312) 555-8819',
    role: 'customer',
    status: 'active',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return { ...parsed, role: normalizeRole(parsed.role) };
      }
      return null;
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
          const fetchedUser = {
            ...response.data.user,
            role: normalizeRole(response.data.user.role),
          };
          setUser(fetchedUser);
          localStorage.setItem('auth_user', JSON.stringify(fetchedUser));
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

    // Client-side standalone fallback
    try {
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser({ ...parsed, role: normalizeRole(parsed.role) });
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
   * Log in via backend REST API or fallback demo.
   * @param {string} loginInput - email or username
   * @param {string} password - user password
   */
  const login = async (loginInput, password) => {
    if (USE_BACKEND_API) {
      try {
        setIsLoading(true);
        const response = await authApi.login(loginInput.trim(), password);
        if (response && response.success && response.data) {
          const { token: newToken, user: rawUser } = response.data;
          const authenticatedUser = {
            ...rawUser,
            role: normalizeRole(rawUser.role),
          };
          setToken(newToken);
          setUser(authenticatedUser);
          localStorage.setItem('auth_token', newToken);
          localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));
          setIsLoading(false);
          return { success: true, user: authenticatedUser };
        }
        setIsLoading(false);
        return { success: false, message: response?.message || 'Login failed.' };
      } catch (error) {
        setIsLoading(false);
        const message = error.response?.data?.message || 'Unable to connect to authentication server.';
        return { success: false, message };
      }
    }

    // Fallback standalone authentication
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const normalizedInput = loginInput.trim().toLowerCase();
    let authenticatedUser = null;

    if (normalizedInput === 'admin@marketlink.com' || normalizedInput === 'admin@gmail.com' || normalizedInput === 'admin') {
      authenticatedUser = DEMO_USERS.admin;
    } else if (normalizedInput === 'farmer@marketlink.com' || normalizedInput === 'operator@gmail.com' || normalizedInput === 'farmer' || normalizedInput === 'operator') {
      authenticatedUser = DEMO_USERS.farmer;
    } else if (normalizedInput === 'customer@marketlink.com' || normalizedInput === 'user@gmail.com' || normalizedInput === 'customer' || normalizedInput === 'user') {
      authenticatedUser = DEMO_USERS.customer;
    } else if (loginInput.trim().length > 0) {
      authenticatedUser = {
        id: Date.now(),
        fullname: loginInput.trim(),
        username: loginInput.trim().toLowerCase().replace(/\s+/g, '_'),
        email: loginInput.includes('@') ? loginInput.trim() : `${loginInput.trim().toLowerCase()}@example.com`,
        phone: '090-000-0000',
        role: 'customer',
        status: 'active',
      };
    }

    if (!authenticatedUser) {
      setIsLoading(false);
      return { success: false, message: 'Invalid login credentials!' };
    }

    const clientToken = `marketlink-session-${authenticatedUser.role}-${Date.now()}`;
    setToken(clientToken);
    setUser(authenticatedUser);
    localStorage.setItem('auth_token', clientToken);
    localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));
    setIsLoading(false);

    return { success: true, user: authenticatedUser };
  };

  /**
   * 1-Click Instant Demo Login for 3 roles: admin, farmer (operator), customer (user).
   * Aligned with Seeder accounts: admin@marketlink.com, farmer@marketlink.com, customer@marketlink.com / password
   */
  const quickDemoLogin = async (targetRole) => {
    const normalizedTarget = normalizeRole(targetRole);

    if (USE_BACKEND_API) {
      const credentials = {
        admin: { login: 'admin@marketlink.com', password: 'password' },
        farmer: { login: 'farmer@marketlink.com', password: 'password' },
        customer: { login: 'customer@marketlink.com', password: 'password' },
      };

      const cred = credentials[normalizedTarget];
      if (!cred) {
        return { success: false, message: `Role "${targetRole}" does not exist.` };
      }

      return login(cred.login, cred.password);
    }

    const targetUser = DEMO_USERS[normalizedTarget] || DEMO_USERS[targetRole];
    if (!targetUser) {
      return { success: false, message: `Role "${targetRole}" does not exist.` };
    }

    const clientToken = `marketlink-demo-${normalizedTarget}-${Date.now()}`;
    setToken(clientToken);
    setUser(targetUser);
    localStorage.setItem('auth_token', clientToken);
    localStorage.setItem('auth_user', JSON.stringify(targetUser));

    return { success: true, user: targetUser };
  };

  /**
   * Register a new customer account.
   */
  const register = async (data) => {
    if (USE_BACKEND_API) {
      try {
        setIsLoading(true);
        const payload = {
          fullname: data.fullname,
          username: data.username,
          email: data.email,
          phone: data.phone,
          address: data.address || '',
          password: data.password,
          password_confirmation: data.password_confirmation || data.confirmPassword || data.password,
        };

        const response = await authApi.register(payload);
        if (response && response.success && response.data) {
          const { token: newToken, user: rawUser } = response.data;
          const newUser = {
            ...rawUser,
            role: normalizeRole(rawUser.role),
          };
          setToken(newToken);
          setUser(newUser);
          localStorage.setItem('auth_token', newToken);
          localStorage.setItem('auth_user', JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true, user: newUser };
        }
        setIsLoading(false);
        return { success: false, message: response?.message || 'Registration failed.' };
      } catch (error) {
        setIsLoading(false);
        const errors = error.response?.data?.errors;
        const firstError = errors ? Object.values(errors).flat()[0] : null;
        const message = firstError || error.response?.data?.message || 'Unable to connect to registration server.';
        return { success: false, message, errors };
      }
    }

    // Fallback standalone registration
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newUser = {
      id: Date.now(),
      fullname: data.fullname.trim(),
      username: data.username.trim().toLowerCase(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      address: data.address || '',
      role: 'customer',
      status: 'active',
    };

    const clientToken = `marketlink-registered-${Date.now()}`;
    setToken(clientToken);
    setUser(newUser);
    localStorage.setItem('auth_token', clientToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setIsLoading(false);

    return { success: true, user: newUser };
  };

  /**
   * Register a new farmer stall application (pending admin approval).
   */
  const registerFarmer = async (data) => {
    if (USE_BACKEND_API) {
      try {
        setIsLoading(true);
        const payload = {
          fullname: data.fullname.trim(),
          username: data.username.trim().toLowerCase(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          password: data.password,
          password_confirmation: data.password_confirmation || data.confirmPassword || data.password,
          stall_name: data.stall_name.trim(),
          contact_person: (data.contact_person || data.fullname).trim(),
          contact_phone: (data.contact_phone || data.phone).trim(),
          address: data.address.trim(),
          description: data.description?.trim() || null,
          latitude: data.latitude ? parseFloat(data.latitude) : null,
          longitude: data.longitude ? parseFloat(data.longitude) : null,
        };

        const response = await authApi.registerFarmer(payload);
        setIsLoading(false);
        if (response && response.success) {
          return { success: true, user: response.data?.user, message: response.message };
        }
        return { success: false, message: response?.message || 'Farmer application failed.' };
      } catch (error) {
        setIsLoading(false);
        const errors = error.response?.data?.errors;
        const firstError = errors ? Object.values(errors).flat()[0] : null;
        const message = firstError || error.response?.data?.message || 'Unable to submit farmer stall application.';
        return { success: false, message, errors };
      }
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
    return {
      success: true,
      message: 'Farmer stall application submitted for evaluation.',
    };
  };

  /**
   * Update active user profile details (fullname, phone, address).
   */
  const updateProfile = async (profileData) => {
    if (USE_BACKEND_API) {
      try {
        setIsLoading(true);
        const payload = {
          fullname: profileData.fullname,
          phone: profileData.phone,
          address: profileData.address,
        };
        const response = await authApi.updateProfile(payload);
        if (response && response.success && response.data?.user) {
          const updatedUser = {
            ...response.data.user,
            role: normalizeRole(response.data.user.role),
          };
          setUser(updatedUser);
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          setIsLoading(false);
          return { success: true, user: updatedUser };
        }
        setIsLoading(false);
        return { success: false, message: response?.message || 'Update failed.' };
      } catch (error) {
        setIsLoading(false);
        const message = error.response?.data?.message || 'Failed to update profile on server.';
        return { success: false, message };
      }
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const updatedUser = {
      ...user,
      ...profileData,
      role: normalizeRole(user?.role),
    };

    setUser(updatedUser);
    try {
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    } catch {
      // ignore storage error
    }
    setIsLoading(false);
    return { success: true, user: updatedUser };
  };

  /**
   * Change account password via backend API.
   */
  const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    if (!currentPassword) {
      return { success: false, message: 'Please enter your current password.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    if (newPassword !== confirmPassword) {
      return { success: false, message: 'New password and confirmation do not match.' };
    }

    if (USE_BACKEND_API) {
      try {
        setIsLoading(true);
        const payload = {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        };
        const response = await authApi.changePassword(payload);
        setIsLoading(false);
        return {
          success: response?.success ?? true,
          message: response?.message || 'Your account password has been updated.',
        };
      } catch (error) {
        setIsLoading(false);
        const message = error.response?.data?.message || 'Failed to update password on server.';
        return { success: false, message };
      }
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);

    return {
      success: true,
      message: 'Your account password has been successfully updated.',
    };
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

  const currentRole = normalizeRole(user?.role);

  const value = {
    user,
    token,
    role: currentRole,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    registerFarmer,
    logout,
    quickDemoLogin,
    updateProfile,
    changePassword,
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
