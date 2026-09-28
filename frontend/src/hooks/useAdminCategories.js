import { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../api/categoryApi';

/**
 * Custom hook for Admin Produce Categories CRUD operations.
 */
export function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await categoryApi.getCategories();
      const list = res.data?.data || res.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load produce categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (categoryData) => {
    try {
      setActionLoading(true);
      const res = await categoryApi.createCategory(categoryData);
      const created = res.data?.data || res.data;
      setCategories((prev) => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create category.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      setActionLoading(true);
      const res = await categoryApi.updateCategory(id, categoryData);
      const updated = res.data?.data || res.data;
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return { success: true, data: updated };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update category.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setActionLoading(true);
      await categoryApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot delete category with associated products.';
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    categories,
    loading,
    actionLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

export default useAdminCategories;
