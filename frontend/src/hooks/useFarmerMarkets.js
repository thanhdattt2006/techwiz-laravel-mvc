import { useState, useEffect, useCallback } from 'react';
import { farmerApi } from '../api/farmerApi';
import { marketApi } from '../api/marketApi';
import { useModal } from '../context/ModalContext';

/**
 * useFarmerMarkets (Phase 4.14)
 * Custom hook for farmer market stall registrations and pickup slot configuration.
 */
export function useFarmerMarkets() {
  const { showAlert, showConfirm } = useModal();

  const [farmerMarkets, setFarmerMarkets] = useState([]);
  const [allMarkets, setAllMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fmRes, allRes] = await Promise.all([
        farmerApi.getFarmerMarkets(),
        marketApi.getMarkets(),
      ]);

      const fmList = fmRes?.data || fmRes || [];
      const allList = allRes?.data || allRes || [];

      setFarmerMarkets(Array.isArray(fmList) ? fmList : []);
      setAllMarkets(Array.isArray(allList) ? allList : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load market stall configurations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openLinkModal = () => {
    setEditingMarket(null);
    setModalOpen(true);
  };

  const openEditModal = (farmerMarket) => {
    setEditingMarket(farmerMarket);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMarket(null);
  };

  const handleSaveMarket = async (formData) => {
    setSubmitting(true);
    try {
      if (editingMarket) {
        const marketId = editingMarket.market_id || editingMarket.market?.id;
        const res = await farmerApi.updateFarmerMarket(marketId, formData);
        const updated = res?.data || res;

        setFarmerMarkets((prev) =>
          prev.map((item) =>
            (item.market_id === marketId || item.market?.id === marketId ? { ...item, ...updated } : item)
          )
        );

        showAlert({
          title: 'Stall Updated',
          message: 'Market stall operating schedule and pickup slots have been updated.',
          type: 'success',
          autoCloseMs: 2000,
        });
      } else {
        const res = await farmerApi.linkMarket(formData);
        const linked = res?.data || res;
        setFarmerMarkets((prev) => [linked, ...prev]);

        showAlert({
          title: 'Stall Registered',
          message: 'Your stall has been registered at the new farmers market.',
          type: 'success',
          autoCloseMs: 2000,
        });
      }
      closeModal();
      return true;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Could not save market configuration.';
      showAlert({ title: 'Registration Failed', message: msg, type: 'danger' });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlinkMarket = async (farmerMarket) => {
    const marketName = farmerMarket.market?.name || 'this market';
    const marketId = farmerMarket.market_id || farmerMarket.market?.id;

    const confirmed = await showConfirm({
      title: 'Withdraw Stall From Market?',
      message: `Are you sure you want to withdraw your stall from ${marketName}? Customers will no longer be able to select this pickup location.`,
      confirmText: 'Yes, Withdraw Stall',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      await farmerApi.unlinkMarket(marketId);
      setFarmerMarkets((prev) =>
        prev.filter((item) => item.market_id !== marketId && item.market?.id !== marketId)
      );
      showAlert({
        title: 'Stall Withdrawn',
        message: `Your stall has been removed from ${marketName}.`,
        type: 'success',
        autoCloseMs: 2000,
      });
    } catch (err) {
      showAlert({
        title: 'Withdraw Failed',
        message: err?.response?.data?.message || 'Could not withdraw stall from market.',
        type: 'danger',
      });
    }
  };

  return {
    farmerMarkets,
    allMarkets,
    loading,
    error,
    modalOpen,
    editingMarket,
    submitting,
    openLinkModal,
    openEditModal,
    closeModal,
    handleSaveMarket,
    handleUnlinkMarket,
    refetch: fetchData,
  };
}
