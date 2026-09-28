import { normalizeRole } from './roleUtils';

/**
 * Storage helpers for authentication session.
 */
export const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('auth_user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return { ...parsed, role: normalizeRole(parsed.role) };
  } catch {
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('auth_token') || null;
};

export const saveSession = (token, user) => {
  try {
    if (token) localStorage.setItem('auth_token', token);
    if (user) {
      const normalized = { ...user, role: normalizeRole(user.role) };
      localStorage.setItem('auth_user', JSON.stringify(normalized));
    }
  } catch {
    // Silently ignore storage quota errors
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  } catch {
    // Silently ignore
  }
};
