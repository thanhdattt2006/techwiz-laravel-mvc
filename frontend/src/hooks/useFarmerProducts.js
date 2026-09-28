import { useState, useEffect, useCallback, useMemo } from 'react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { useModal } from '../context/ModalContext';

/**
 * useFarmerProducts (Phase 4.13)
 * Custom hook for farmer produce inventory CRUD and real-time stock management.
 */
export function useFarmerProducts() {
  const { showAlert, showConfirm } = useModal();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  // Loading indicator for quick inline stock adjustments
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getFarmerProducts(),
        categoryApi.getCategories(),
      ]);

      const prodList = prodRes?.data || prodRes || [];
      const catList = catRes?.data || catRes || [];

      setProducts(Array.isArray(prodList) ? prodList : []);
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load produce inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search by name
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch) return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL') {
        const catId = Number(selectedCategory);
        if (p.category_id !== catId && p.category?.id !== catId) return false;
      }
      // Availability filter
      if (availabilityFilter !== 'ALL') {
        if (p.availability !== availabilityFilter) return false;
      }
      return true;
    });
  }, [products, searchQuery, selectedCategory, availabilityFilter]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (formData) => {
    setSubmitting(true);
    try {
      if (editingProduct?.id) {
        const res = await productApi.updateProduct(editingProduct.id, formData);
        const updated = res?.data || res;
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? { ...item, ...updated } : item))
        );
        showAlert({
          title: 'Produce Updated',
          message: `"${formData.name}" has been updated in your stall inventory.`,
          type: 'success',
          autoCloseMs: 2000,
        });
      } else {
        const res = await productApi.createProduct(formData);
        const created = res?.data || res;
        setProducts((prev) => [created, ...prev]);
        showAlert({
          title: 'Produce Created',
          message: `"${formData.name}" has been listed in your stall catalog.`,
          type: 'success',
          autoCloseMs: 2000,
        });
      }
      closeModal();
      return true;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save produce item.';
      showAlert({ title: 'Error Saving Produce', message: msg, type: 'danger' });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = (product) => {
    showConfirm({
      title: 'Remove Produce Item?',
      message: `Are you sure you want to remove "${product.name}" from your stall catalog? Reserved quantities in active pre-orders will remain intact.`,
      confirmText: 'Yes, Remove Produce',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await productApi.deleteProduct(product.id);
          setProducts((prev) => prev.filter((item) => item.id !== product.id));
          showAlert({
            title: 'Produce Removed',
            message: `"${product.name}" has been removed from your stall catalog.`,
            type: 'success',
            autoCloseMs: 2000,
          });
        } catch (err) {
          showAlert({
            title: 'Delete Failed',
            message: err?.response?.data?.message || err?.message || 'Failed to delete produce item.',
            type: 'danger',
          });
        }
      },
    });
  };

  // Quick Stock Quantity Adjustment (+ / -)
  const handleQuickAdjustStock = async (product, delta) => {
    const currentQty = Number(product.stock_quantity || 0);
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === currentQty) return;

    setActionLoadingId(product.id);
    try {
      const payload = {
        stock_quantity: newQty,
        availability: newQty > 0 ? 'available' : 'sold_out',
      };
      await productApi.updateProduct(product.id, payload);
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, ...payload } : item))
      );
    } catch (err) {
      showAlert({
        title: 'Adjustment Failed',
        message: err?.response?.data?.message || 'Could not adjust stock quantity.',
        type: 'danger',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick Toggle Availability
  const handleQuickToggleAvailability = async (product, newAvailability) => {
    if (product.availability === newAvailability) return;

    setActionLoadingId(product.id);
    try {
      const payload = { availability: newAvailability };
      await productApi.updateProduct(product.id, payload);
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, availability: newAvailability } : item))
      );
    } catch (err) {
      showAlert({
        title: 'Status Update Failed',
        message: err?.response?.data?.message || 'Could not update produce availability.',
        type: 'danger',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
    products,
    categories,
    filteredProducts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    availabilityFilter,
    setAvailabilityFilter,
    actionLoadingId,
    modalOpen,
    editingProduct,
    submitting,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSaveProduct,
    handleDeleteProduct,
    handleQuickAdjustStock,
    handleQuickToggleAvailability,
    refetch: fetchData,
  };
}
