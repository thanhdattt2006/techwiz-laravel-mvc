import { useState, useEffect, useCallback } from 'react';
import { marketApi } from '../api/marketApi';

/**
 * Custom hook for Admin Farmers Markets CRUD operations.
 */
export function useAdminMarkets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await marketApi.getMarkets();
      const list = res.data?.data || res.data || [];
      setMarkets(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load farmers markets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const createMarket = async (marketData) => {
    try {
      setActionLoading(true);
      const res = await marketApi.createMarket(marketData);
      const created = res.data?.data || res.data;
      setMarkets((prev) => [created, ...prev]);
      return { success: true, data: created };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create market venue.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const updateMarket = async (id, marketData) => {
    try {
      setActionLoading(true);
      const res = await marketApi.updateMarket(id, marketData);
      const updated = res.data?.data || res.data;
      setMarkets((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return { success: true, data: updated };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update market venue.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMarket = async (id) => {
    try {
      setActionLoading(true);
      await marketApi.deleteMarket(id);
      setMarkets((prev) => prev.filter((m) => m.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to deactivate market venue.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    markets,
    loading,
    actionLoading,
    error,
    fetchMarkets,
    createMarket,
    updateMarket,
    deleteMarket,
  };
}

export default useAdminMarkets;
