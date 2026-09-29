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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getFarmerProducts(),
        categoryApi.getCategories(),
      ]);
      setProducts(Array.isArray(prodRes?.data || prodRes) ? (prodRes?.data || prodRes) : []);
      setCategories(Array.isArray(catRes?.data || catRes) ? (catRes?.data || catRes) : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load produce inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const match = p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query);
        if (!match) return false;
      }
      if (selectedCategory !== 'ALL') {
        const catId = Number(selectedCategory);
        if (p.category_id !== catId && p.category?.id !== catId) return false;
      }
      if (availabilityFilter !== 'ALL' && p.availability !== availabilityFilter) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory, availabilityFilter]);

  const openCreateModal = () => { setEditingProduct(null); setModalOpen(true); };
  const openEditModal = (product) => { setEditingProduct(product); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingProduct(null); };

  const handleSaveProduct = async (formData) => {
    setSubmitting(true);
    try {
      if (editingProduct?.id) {
        const res = await productApi.updateProduct(editingProduct.id, formData);
        const updated = res?.data || res;
        setProducts((prev) => prev.map((item) => (item.id === editingProduct.id ? { ...item, ...updated } : item)));
        showAlert({ title: 'Produce Updated', message: `"${formData.name}" has been updated.`, type: 'success', autoCloseMs: 2000 });
      } else {
        const res = await productApi.createProduct(formData);
        const created = res?.data || res;
        setProducts((prev) => [created, ...prev]);
        showAlert({ title: 'Produce Created', message: `"${formData.name}" has been listed.`, type: 'success', autoCloseMs: 2000 });
      }
      closeModal();
      return true;
    } catch (err) {
      showAlert({ title: 'Error Saving Produce', message: err?.response?.data?.message || err?.message || 'Failed to save.', type: 'danger' });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = await showConfirm({
      title: 'Remove Produce Item?',
      message: `Are you sure you want to remove "${product.name}" from your stall catalog?`,
      confirmText: 'Yes, Remove Produce',
      cancelText: 'Cancel',
      type: 'danger',
    });
    if (!confirmed) return;
    try {
      await productApi.deleteProduct(product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      showAlert({ title: 'Produce Removed', message: `"${product.name}" has been removed.`, type: 'success', autoCloseMs: 2000 });
    } catch (err) {
      showAlert({ title: 'Delete Failed', message: err?.response?.data?.message || 'Failed to delete produce item.', type: 'danger' });
    }
  };

  const handleQuickAdjustStock = async (product, delta) => {
    const currentQty = Number(product.stock_quantity || 0);
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === currentQty) return;
    setActionLoadingId(product.id);
    try {
      const payload = { stock_quantity: newQty, availability: newQty > 0 ? 'available' : 'sold_out' };
      await productApi.updateProduct(product.id, payload);
      setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, ...payload } : item)));
    } catch (err) {
      showAlert({ title: 'Adjustment Failed', message: err?.response?.data?.message || 'Could not adjust stock.', type: 'danger' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleQuickToggleAvailability = async (product, newAvailability) => {
    if (product.availability === newAvailability) return;
    setActionLoadingId(product.id);
    try {
      const payload = { availability: newAvailability };
      await productApi.updateProduct(product.id, payload);
      setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, availability: newAvailability } : item)));
    } catch (err) {
      showAlert({ title: 'Status Update Failed', message: err?.response?.data?.message || 'Could not update availability.', type: 'danger' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
    products, categories, filteredProducts, loading, error,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    availabilityFilter, setAvailabilityFilter, actionLoadingId, modalOpen,
    editingProduct, submitting, openCreateModal, openEditModal, closeModal,
    handleSaveProduct, handleDeleteProduct, handleQuickAdjustStock,
    handleQuickToggleAvailability, refetch: fetchData,
  };
}
