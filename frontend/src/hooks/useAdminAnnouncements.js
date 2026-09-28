import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';

/**
 * Custom hook for Admin Platform Announcements CRUD operations.
 */
export function useAdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnnouncements = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationApi.getAdminAnnouncements(params);
      const list = res.data?.data || res.data || [];
      setAnnouncements(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const createAnnouncement = async (data) => {
    try {
      setActionLoading(true);
      const res = await notificationApi.createAnnouncement(data);
      const created = res.data?.data || res.data;
      setAnnouncements((prev) => [created, ...prev]);
      return { success: true, data: created };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish announcement.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const updateAnnouncement = async (id, data) => {
    try {
      setActionLoading(true);
      const res = await notificationApi.updateAnnouncement(id, data);
      const updated = res.data?.data || res.data;
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return { success: true, data: updated };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update announcement.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      setActionLoading(true);
      await notificationApi.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete announcement.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const toggleActiveAnnouncement = async (id, currentStatus) => {
    return updateAnnouncement(id, { is_active: !currentStatus });
  };

  return {
    announcements,
    loading,
    actionLoading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleActiveAnnouncement,
  };
}

export default useAdminAnnouncements;
