import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for in-app user notifications with real-time unread count.
 */
export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await notificationApi.getNotifications();
      const payload = res.data?.data || res.data || {};
      const list = payload.notifications || (Array.isArray(payload) ? payload : []);
      setNotifications(list);
      setUnreadCount(Number(payload.unread_count ?? list.filter((n) => !n.is_read).length));
    } catch {
      // silently handle auth expiry or network glitch
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      setActionLoading(true);
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return { success: true };
    } catch {
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionLoading(true);
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      return { success: true };
    } catch {
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    actionLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}

export default useNotifications;
