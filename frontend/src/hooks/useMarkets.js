import { useState, useEffect, useMemo, useCallback } from 'react';
import { marketApi, favoriteApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

export const DAYS_OF_WEEK = [
  { label: 'All Days', value: 'ALL' },
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

/**
 * Custom Hook: useMarkets
 * Encapsulates all data-fetching and filtering logic for the Farmers Markets directory.
 * Complies with SOLID (Single Responsibility) by separating business logic from UI components.
 */
export function useMarkets() {
  const { isAuthenticated } = useAuth();
  const { showAlert } = useModal();

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('ALL');

  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [selectedMarketDetail, setSelectedMarketDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [favoritedIds, setFavoritedIds] = useState([]);

  // 1. Fetch active markets
  useEffect(() => {
    let isMounted = true;
    const fetchMarkets = async () => {
      try {
        const res = await marketApi.getMarkets();
        if (isMounted) {
          const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setMarkets(list);
          if (list.length > 0) {
            setSelectedMarketId((prev) => prev || list[0].id);
          }
        }
      } catch {
        if (isMounted) setMarkets([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMarkets();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch favorited markets for logged-in shoppers
  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated) return;

    const fetchFavorites = async () => {
      try {
        const res = await favoriteApi.getFavorites({ type: 'market' });
        if (isMounted && res?.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.data || [];
          const ids = list.map((item) => item.favoritable_id || item.id);
          setFavoritedIds(ids);
        }
      } catch {
        // Silently catch
      }
    };

    fetchFavorites();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // 3. Fetch detailed market info including participating stalls roster
  useEffect(() => {
    if (!selectedMarketId) return;
    let isMounted = true;

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const res = await marketApi.getMarket(selectedMarketId);
        if (isMounted && res?.data) {
          setSelectedMarketDetail(res.data);
        }
      } catch {
        if (isMounted) {
          const fallback = markets.find((m) => m.id === selectedMarketId);
          setSelectedMarketDetail(fallback || null);
        }
      } finally {
        if (isMounted) setLoadingDetail(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [selectedMarketId, markets]);

  // Toggle Favorite
  const toggleFavorite = useCallback(
    async (marketId, e) => {
      if (e) e.stopPropagation();

      if (!isAuthenticated) {
        showAlert({
          title: 'Sign In Required',
          message: 'Please sign in to your shopper account to save your favorite farmers markets.',
          type: 'info',
        });
        return;
      }

      try {
        const res = await favoriteApi.toggleFavorite('market', marketId);
        const isFav = res?.data?.is_favorited;
        setFavoritedIds((prev) =>
          isFav ? [...prev, marketId] : prev.filter((id) => id !== marketId)
        );
      } catch (err) {
        showAlert({
          title: 'Bookmark Failed',
          message: err?.response?.data?.message || 'Could not update favorite status.',
          type: 'error',
        });
      }
    },
    [isAuthenticated, showAlert]
  );

  // Filter markets by keyword and day of week
  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        (m.name || '').toLowerCase().includes(query) ||
        (m.address || '').toLowerCase().includes(query) ||
        (m.neighborhood || '').toLowerCase().includes(query) ||
        (m.description || '').toLowerCase().includes(query);

      let matchesDay = true;
      if (selectedDay !== 'ALL') {
        const targetDay = Number(selectedDay);
        if (m.schedules && m.schedules.length > 0) {
          matchesDay = m.schedules.some((s) => Number(s.day_of_week) === targetDay);
        } else if (m.operatingDays) {
          const dayName = DAYS_OF_WEEK.find((d) => d.value === targetDay)?.label || '';
          matchesDay = m.operatingDays.toLowerCase().includes(dayName.toLowerCase());
        }
      }

      return matchesSearch && matchesDay;
    });
  }, [markets, searchTerm, selectedDay]);

  const activeMarket =
    selectedMarketDetail ||
    markets.find((m) => m.id === selectedMarketId) ||
    markets[0] ||
    null;

  return {
    markets,
    filteredMarkets,
    activeMarket,
    selectedMarketId,
    setSelectedMarketId,
    loading,
    loadingDetail,
    searchTerm,
    setSearchTerm,
    selectedDay,
    setSelectedDay,
    favoritedIds,
    toggleFavorite,
  };
}

export default useMarkets;
