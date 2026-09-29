import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';
import { useModal } from '../context/ModalContext';

/**
 * useAdminFarmers (Phase 4.15)
 * Custom hook for farmer stall application approvals and rejection workflow.
 */
export function useAdminFarmers() {
  const { showAlert, showConfirm } = useModal();

  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [submittingReject, setSubmittingReject] = useState(false);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getPendingFarmers();
      const list = res?.data || res || [];
      setPendingFarmers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not load pending farmer applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (farmer) => {
    const stallName = farmer.stall_name || farmer.user?.fullname || 'Farmer Stall';

    const confirmed = await showConfirm({
      title: 'Approve Stall Application?',
      message: `Authorize "${stallName}" to start listing produce and operating at local farmers markets?`,
      confirmText: 'Yes, Approve Stall',
      cancelText: 'Cancel',
      type: 'success',
    });

    if (!confirmed) return;

    setActionLoadingId(farmer.id);
    try {
      await adminApi.approveFarmer(farmer.id);
      setPendingFarmers((prev) => prev.filter((f) => f.id !== farmer.id));
      showAlert({
        title: 'Stall Approved!',
        message: `"${stallName}" has been approved. The farmer can now log in and link market stalls.`,
        type: 'success',
        autoCloseMs: 2500,
      });
    } catch (err) {
      showAlert({
        title: 'Approval Failed',
        message: err?.response?.data?.message || 'Could not approve farmer application.',
        type: 'danger',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (farmer) => {
    setSelectedFarmer(farmer);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedFarmer(null);
  };

  const handleReject = async (farmerId, reason) => {
    setSubmittingReject(true);
    try {
      await adminApi.rejectFarmer(farmerId, reason);
      setPendingFarmers((prev) => prev.filter((f) => f.id !== farmerId));
      showAlert({
        title: 'Application Rejected',
        message: 'The stall application was rejected and a notification with reason was sent.',
        type: 'success',
        autoCloseMs: 2500,
      });
      closeRejectModal();
    } catch (err) {
      showAlert({
        title: 'Rejection Failed',
        message: err?.response?.data?.message || 'Could not reject application.',
        type: 'danger',
      });
    } finally {
      setSubmittingReject(false);
    }
  };

  return {
    pendingFarmers,
    loading,
    error,
    actionLoadingId,
    rejectModalOpen,
    selectedFarmer,
    submittingReject,
    handleApprove,
    openRejectModal,
    closeRejectModal,
    handleReject,
    refetch: fetchPending,
  };
}
