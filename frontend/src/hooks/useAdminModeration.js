import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../api/productApi';
import { reviewApi } from '../api/reviewApi';

/**
 * Custom hook for Admin Catalog & Review Moderation (Toggle Hide).
 */
export function useAdminModeration() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoadingProducts(true);
      const res = await productApi.getAdminProducts(params);
      const list = res.data?.data || res.data || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products for moderation.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchReviews = useCallback(async (params = {}) => {
    try {
      setLoadingReviews(true);
      const res = await reviewApi.getAdminReviews(params);
      const list = res.data?.data || res.data || [];
      setReviews(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews for moderation.');
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, [fetchProducts, fetchReviews]);

  const toggleHideProduct = async (id) => {
    try {
      setActionLoading(true);
      const res = await productApi.toggleHide(id);
      const updated = res.data?.data || res.data;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_hidden: updated.is_hidden } : p))
      );
      return { success: true, is_hidden: updated.is_hidden };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to toggle product visibility.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const toggleHideReview = async (id) => {
    try {
      setActionLoading(true);
      const res = await reviewApi.toggleHideReview(id);
      const updated = res.data?.data || res.data;
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_hidden: updated.is_hidden } : r))
      );
      return { success: true, is_hidden: updated.is_hidden };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to toggle review visibility.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    products,
    reviews,
    loadingProducts,
    loadingReviews,
    actionLoading,
    error,
    fetchProducts,
    fetchReviews,
    toggleHideProduct,
    toggleHideReview,
  };
}

export default useAdminModeration;
