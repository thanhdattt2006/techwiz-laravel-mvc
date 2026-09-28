import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi.js';
import { normalizeRole } from '../utils/roleUtils.js';
import { getStoredUser, getStoredToken, saveSession, clearSession } from '../utils/authStorage.js';
import {
  performLogin,
  performRegister,
  performRegisterFarmer,
  DEMO_CREDENTIALS,
} from './authActions.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication with backend Sanctum
  const checkAuth = useCallback(async () => {
    const savedToken = getStoredToken();
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      if (response && response.success && response.data?.user) {
        const fetchedUser = {
          ...response.data.user,
          role: normalizeRole(response.data.user.role),
        };
        setUser(fetchedUser);
        saveSession(savedToken, fetchedUser);
      }
    } catch {
      setUser(null);
      setToken(null);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      clearSession();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [checkAuth]);

  const login = async (loginInput, password) => {
    setIsLoading(true);
    const result = await performLogin(loginInput, password, setToken, setUser);
    setIsLoading(false);
    return result;
  };

  const quickDemoLogin = async (targetRole) => {
    const normalizedTarget = normalizeRole(targetRole);
    const cred = DEMO_CREDENTIALS[normalizedTarget];
    if (!cred) {
      return { success: false, message: `Role "${targetRole}" does not exist.` };
    }
    return login(cred.login, cred.password);
  };

  const register = async (data) => {
    setIsLoading(true);
    const result = await performRegister(data, setToken, setUser);
    setIsLoading(false);
    return result;
  };

  const registerFarmer = async (data) => {
    setIsLoading(true);
    const result = await performRegisterFarmer(data);
    setIsLoading(false);
    return result;
  };

  const updateProfile = async (profileData) => {
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
        saveSession(token, updatedUser);
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
  };

  const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    if (!currentPassword) return { success: false, message: 'Please enter your current password.' };
    if (!newPassword || newPassword.length < 6) return { success: false, message: 'New password must be at least 6 characters.' };
    if (newPassword !== confirmPassword) return { success: false, message: 'New password and confirmation do not match.' };

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
  };

  const logout = async () => {
    if (token) {
      try {
        await authApi.logout();
      } catch {
        // Silently catch
      }
    }
    setUser(null);
    setToken(null);
    clearSession();
  };

  const value = {
    user,
    token,
    role: normalizeRole(user?.role),
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
