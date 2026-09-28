import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../api/adminApi';

/**
 * Custom hook for Admin Contact Inquiries Inbox & Resolution.
 */
export function useAdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterRead, setFilterRead] = useState('all'); // 'all' | 'unread' | 'read'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getInquiries();
      const list = res.data?.data || res.data || [];
      setInquiries(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customer inquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const markAsRead = async (id) => {
    try {
      setActionLoading(true);
      await adminApi.markInquiryRead(id);
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to mark inquiry as handled.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesRead =
        filterRead === 'all'
          ? true
          : filterRead === 'unread'
          ? !item.is_read
          : item.is_read;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.subject && item.subject.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q));

      return matchesRead && matchesSearch;
    });
  }, [inquiries, filterRead, searchQuery]);

  const unreadCount = useMemo(() => {
    return inquiries.filter((item) => !item.is_read).length;
  }, [inquiries]);

  return {
    inquiries: filteredInquiries,
    totalCount: inquiries.length,
    unreadCount,
    loading,
    actionLoading,
    error,
    filterRead,
    setFilterRead,
    searchQuery,
    setSearchQuery,
    fetchInquiries,
    markAsRead,
  };
}

export default useAdminInquiries;
