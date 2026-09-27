import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi, marketApi, favoriteApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

/**
 * Custom Hook: useProducts
 * Encapsulates data fetching, multi-criteria filtering, and customer bookmarks
 * for the Produce Catalog, adhering to SOLID principles.
 */
export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { showAlert } = useModal();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL query params or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [selectedMarketId, setSelectedMarketId] = useState(searchParams.get('market_id') || 'ALL');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('max_price')) || 25);
  const [organicOnly, setOrganicOnly] = useState(searchParams.get('organic') === 'true');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('in_stock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'default');

  const [favoritedIds, setFavoritedIds] = useState([]);

  // Check if any non-default filter is active
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'ALL' ||
    selectedMarketId !== 'ALL' ||
    maxPrice < 25 ||
    organicOnly ||
    inStockOnly ||
    sortBy !== 'default';

  // 1. Fetch Categories & Markets metadata
  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      try {
        const [catsRes, marketsRes] = await Promise.allSettled([
          categoryApi.getCategories(),
          marketApi.getMarkets(),
        ]);

        if (isMounted) {
          if (catsRes.status === 'fulfilled' && catsRes.value?.data) {
            const list = Array.isArray(catsRes.value.data)
              ? catsRes.value.data
              : catsRes.value.data?.data || [];
            setCategories(list);
          }
          if (marketsRes.status === 'fulfilled' && marketsRes.value?.data) {
            const list = Array.isArray(marketsRes.value.data)
              ? marketsRes.value.data
              : marketsRes.value.data?.data || [];
            setMarkets(list);
          }
        }
      } catch {
        // Silently catch
      }
    };

    fetchMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Customer Favorites
  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated) return;

    const fetchFavorites = async () => {
      try {
        const res = await favoriteApi.getFavorites({ type: 'product' });
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

  // 3. Fetch Products matching active filters
  const fetchFilteredProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (selectedCategory !== 'ALL') {
        const cat = categories.find(
          (c) =>
            c.id?.toString() === selectedCategory.toString() ||
            c.slug?.toLowerCase() === selectedCategory.toLowerCase() ||
            c.name?.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (cat) {
          params.category_id = cat.id;
        } else {
          params.category_slug = selectedCategory;
        }
      }

      if (selectedMarketId !== 'ALL') {
        params.market_id = selectedMarketId;
      }

      if (maxPrice < 25) {
        params.max_price = maxPrice;
      }

      if (inStockOnly) {
        params.in_stock_only = true;
      }

      if (sortBy !== 'default') {
        params.sort_by = sortBy;
      }

      const res = await productApi.getProducts(params);
      let list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      // Client-side fallback filter for organic flag if not handled by backend filter
      if (organicOnly) {
        list = list.filter(
          (p) =>
            p.isOrganic ||
            (p.tag && p.tag.toLowerCase().includes('organic')) ||
            (p.description && p.description.toLowerCase().includes('organic'))
        );
      }

      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    selectedCategory,
    categories,
    selectedMarketId,
    maxPrice,
    inStockOnly,
    sortBy,
    organicOnly,
  ]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  // Toggle Favorite
  const toggleFavorite = useCallback(
    async (productId, e) => {
      if (e) e.stopPropagation();

      if (!isAuthenticated) {
        showAlert({
          title: 'Sign In Required',
          message: 'Please sign in to your shopper account to bookmark your favorite produce items.',
          type: 'info',
        });
        return;
      }

      try {
        const res = await favoriteApi.toggleFavorite('product', productId);
        const isFav = res?.data?.is_favorited;
        setFavoritedIds((prev) =>
          isFav ? [...prev, productId] : prev.filter((id) => id !== productId)
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

  // Reset Filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedMarketId('ALL');
    setMaxPrice(25);
    setOrganicOnly(false);
    setInStockOnly(false);
    setSortBy('default');
    setSearchParams({});
  }, [setSearchParams]);

  return {
    products,
    categories,
    markets,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedMarketId,
    setSelectedMarketId,
    maxPrice,
    setMaxPrice,
    organicOnly,
    setOrganicOnly,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    hasActiveFilters,
    favoritedIds,
    toggleFavorite,
    resetFilters,
  };
}

export default useProducts;
