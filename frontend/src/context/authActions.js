import authApi from '../api/authApi';
import { normalizeRole } from '../utils/roleUtils';
import { saveSession } from '../utils/authStorage';

/**
 * Auth action handlers connecting directly to Backend API.
 */
export const performLogin = async (loginInput, password, setToken, setUser) => {
  try {
    const response = await authApi.login(loginInput.trim(), password);
    if (response && response.success && response.data) {
      const { token: newToken, user: rawUser } = response.data;
      const authenticatedUser = {
        ...rawUser,
        role: normalizeRole(rawUser.role),
      };
      setToken(newToken);
      setUser(authenticatedUser);
      saveSession(newToken, authenticatedUser);
      return { success: true, user: authenticatedUser };
    }
    return { success: false, message: response?.message || 'Login failed.' };
  } catch (error) {
    const message = error.response?.data?.message || 'Unable to connect to authentication server.';
    return { success: false, message };
  }
};

export const performRegister = async (data, setToken, setUser) => {
  try {
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
      const newUser = { ...rawUser, role: normalizeRole(rawUser.role) };
      setToken(newToken);
      setUser(newUser);
      saveSession(newToken, newUser);
      return { success: true, user: newUser };
    }
    return { success: false, message: response?.message || 'Registration failed.' };
  } catch (error) {
    const errors = error.response?.data?.errors;
    const firstError = errors ? Object.values(errors).flat()[0] : null;
    const message = firstError || error.response?.data?.message || 'Unable to connect to registration server.';
    return { success: false, message, errors };
  }
};

export const performRegisterFarmer = async (data) => {
  try {
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
    if (response && response.success) {
      return { success: true, user: response.data?.user, message: response.message };
    }
    return { success: false, message: response?.message || 'Farmer application failed.' };
  } catch (error) {
    const errors = error.response?.data?.errors;
    const firstError = errors ? Object.values(errors).flat()[0] : null;
    const message = firstError || error.response?.data?.message || 'Unable to submit farmer stall application.';
    return { success: false, message, errors };
  }
};

export const DEMO_CREDENTIALS = {
  admin: { login: 'admin@marketlink.com', password: 'password' },
  farmer: { login: 'farmer@marketlink.com', password: 'password' },
  customer: { login: 'customer@marketlink.com', password: 'password' },
};
