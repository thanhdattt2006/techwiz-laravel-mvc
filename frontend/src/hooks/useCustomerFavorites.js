import { useState, useEffect, useCallback, useMemo } from 'react';
import favoriteApi from '../api/favoriteApi';
import { useModal } from '../context/ModalContext';

/**
 * useCustomerFavorites Custom Hook (Phase 4.11)
 * Encapsulates retrieving favorited produce, markets, and farmer stalls,
 * filtering by entity type, and live unfavorite/favorite toggling.
 */
export function useCustomerFavorites() {
  const { showAlert } = useModal();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'product' | 'market' | 'farmer'
  const [togglingId, setTogglingId] = useState(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await favoriteApi.getFavorites();
      const list = res?.data?.data || res?.data || [];
      setFavorites(Array.isArray(list) ? list : []);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to retrieve your favorites.';
      setError(msg);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Remove / Toggle favorite
  const removeFavorite = useCallback(
    async (type, targetId) => {
      setTogglingId(`${type}-${targetId}`);
      try {
        await favoriteApi.toggleFavorite(type, targetId);
        setFavorites((prev) =>
          prev.filter((f) => !(f.favoritable_type === type && f.favoritable_id === targetId))
        );
        showAlert({
          title: 'Removed from Favorites',
          message: 'Item has been removed from your saved favorites list.',
          type: 'info',
          autoCloseMs: 1600,
        });
      } catch (err) {
        const msg = err?.response?.data?.message || 'Could not update favorites.';
        showAlert({
          title: 'Error',
          message: msg,
          type: 'danger',
        });
      } finally {
        setTogglingId(null);
      }
    },
    [showAlert]
  );

  // Type counts
  const counts = useMemo(() => {
    let products = 0;
    let markets = 0;
    let farmers = 0;

    favorites.forEach((fav) => {
      if (fav.favoritable_type === 'product') products++;
      else if (fav.favoritable_type === 'market') markets++;
      else if (fav.favoritable_type === 'farmer') farmers++;
    });

    return {
      all: favorites.length,
      products,
      markets,
      farmers,
    };
  }, [favorites]);

  // Filtered list
  const filteredFavorites = useMemo(() => {
    if (filterType === 'ALL') return favorites;
    return favorites.filter((fav) => fav.favoritable_type === filterType);
  }, [favorites, filterType]);

  return {
    favorites,
    filteredFavorites,
    loading,
    error,
    filterType,
    setFilterType,
    counts,
    togglingId,
    removeFavorite,
    refetch: fetchFavorites,
  };
}

export default useCustomerFavorites;
