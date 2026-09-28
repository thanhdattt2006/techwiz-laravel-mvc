import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

const DEFAULT_STATS = {
  revenue: { gross_completed: 0, currency: 'USD' },
  orders: {
    total: 0,
    by_status: {
      placed: 0,
      accepted: 0,
      ready_for_pickup: 0,
      completed: 0,
      cancelled: 0,
      declined: 0,
    },
  },
  users: {
    total: 0,
    customers: 0,
    farmers: 0,
    pending_farmers: 0,
    active_farmers: 0,
    banned: 0,
  },
  markets: { total: 0, active: 0 },
  products: { total: 0, available: 0, sold_out: 0 },
  reviews: { total_visible: 0, platform_average: 0 },
  inquiries: { total: 0, unread: 0 },
  top_farmers: [],
};

/**
 * useAdminOverview (Phase 4.15)
 * Fetches real-time platform overview KPIs and statistics from /api/v1/admin/stats/overview.
 */
export function useAdminOverview() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getOverviewStats();
      const data = res?.data || res || {};
      setStats({
        revenue: data.revenue || DEFAULT_STATS.revenue,
        orders: data.orders || DEFAULT_STATS.orders,
        users: data.users || DEFAULT_STATS.users,
        markets: data.markets || DEFAULT_STATS.markets,
        products: data.products || DEFAULT_STATS.products,
        reviews: data.reviews || DEFAULT_STATS.reviews,
        inquiries: data.inquiries || DEFAULT_STATS.inquiries,
        top_farmers: Array.isArray(data.top_farmers) ? data.top_farmers : [],
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not load platform overview stats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    stats,
    loading,
    error,
    refetch: fetchOverview,
  };
}
