import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { useModal } from '../context/ModalContext';

/**
 * Custom Hook: useOrderTracking
 * Encapsulates public/authenticated pre-order tracking by unique order code,
 * step resolution from State Machine, real cutoff countdown, and live cancellations.
 */
export function useOrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const activeTrackingCode = (id || '').trim();

  // Fetch Order by Code
  const fetchOrder = useCallback(async (code) => {
    if (!code) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.trackOrder(code);
      const data = res?.data?.data || res?.data;
      setOrder(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        `No pre-order found matching reservation code "${code}". Please verify the code on your receipt.`;
      setError(msg);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTrackingCode) {
      fetchOrder(activeTrackingCode);
    } else {
      setLoading(false);
    }
  }, [activeTrackingCode, fetchOrder]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const clean = searchInput.trim().toUpperCase();
    if (clean) {
      navigate(`/orders/track/${encodeURIComponent(clean)}`);
      setSearchInput('');
    }
  };

  // State Machine Step computation
  const status = order?.status || '';
  const isCancelled = status === 'cancelled';
  const isDeclined = status === 'declined';

  const currentStep = useMemo(() => {
    if (status === 'placed') return 1;
    if (status === 'accepted') return 2;
    if (status === 'ready_for_pickup') return 3;
    if (status === 'completed') return 4;
    return 1;
  }, [status]);

  // Stepper timeline items with live timestamps
  const steps = useMemo(() => {
    const formatDate = (isoString) => {
      if (!isoString) return null;
      try {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return null;
      }
    };

    return [
      {
        step: 1,
        title: 'Order Placed',
        desc: 'Pre-order request received & logged into farmer harvest queue',
        time: formatDate(order?.created_at) || 'Pending',
        isPassed: !isCancelled && !isDeclined && currentStep >= 1,
        isCurrent: !isCancelled && !isDeclined && currentStep === 1,
      },
      {
        step: 2,
        title: 'Farmer Confirmed',
        desc: 'Grower verified crop availability & accepted pre-order reservation',
        time: formatDate(order?.accepted_at) || (currentStep >= 2 ? 'Confirmed' : 'Awaiting review'),
        isPassed: !isCancelled && !isDeclined && currentStep >= 2,
        isCurrent: !isCancelled && !isDeclined && currentStep === 2,
      },
      {
        step: 3,
        title: 'Ready for Pickup',
        desc: `Produce harvested fresh & held ready at ${order?.stall_location || 'stall'}`,
        time: formatDate(order?.ready_at) || (currentStep >= 3 ? 'Ready' : 'Awaiting harvest'),
        isPassed: !isCancelled && !isDeclined && currentStep >= 3,
        isCurrent: !isCancelled && !isDeclined && currentStep === 3,
      },
      {
        step: 4,
        title: 'Completed Pickup',
        desc: 'Produce inspected, received at booth & cash/card settled in person',
        time: formatDate(order?.completed_at) || (currentStep >= 4 ? 'Completed' : 'Awaiting pickup'),
        isPassed: !isCancelled && !isDeclined && currentStep >= 4,
        isCurrent: !isCancelled && !isDeclined && currentStep === 4,
      },
    ];
  }, [order, currentStep, isCancelled, isDeclined]);

  // Countdown timer to cutoff or pickup deadline
  useEffect(() => {
    if (!order || isCancelled || isDeclined || status === 'completed') {
      setSecondsRemaining(0);
      return;
    }

    let targetIso = order.cutoff_at;
    if (status === 'ready_for_pickup' && order.pickup_date && order.pickup_end_time) {
      targetIso = `${order.pickup_date}T${order.pickup_end_time}:00`;
    }

    if (!targetIso) return;

    const calculateRemaining = () => {
      const diffMs = new Date(targetIso).getTime() - Date.now();
      const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
      setSecondsRemaining(diffSecs);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [order, isCancelled, isDeclined, status]);

  // Format seconds to HH:MM:SS
  const formattedTimer = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;
    return `${hours.toString().padStart(2, '0')}h ${mins
      .toString()
      .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }, [secondsRemaining]);

  // Cancel Order Handler
  const handleCancelOrder = async () => {
    if (!order || !order.can_be_cancelled) {
      showAlert({
        title: 'Cancellation Not Allowed',
        message: 'This pre-order cannot be cancelled because the cutoff time has already passed.',
        type: 'warning',
      });
      return;
    }

    const confirmed = await showConfirm({
      title: 'Cancel Pre-Order Reservation?',
      message: `Are you sure you want to cancel reservation #${order.order_code}? The farmer will be notified and stock will be returned.`,
      confirmText: 'Yes, Cancel Pre-Order',
      cancelText: 'Keep Pre-Order',
      type: 'warning',
    });

    if (!confirmed) return;

    setCancelling(true);
    try {
      await orderApi.cancelOrder(order.id, 'Cancelled by customer on tracker page');
      showAlert({
        title: 'Reservation Cancelled',
        message: `Your pre-order #${order.order_code} was successfully cancelled. Zero fees applied.`,
        type: 'info',
      });
      await fetchOrder(order.order_code);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to cancel reservation.';
      showAlert({
        title: 'Cancellation Error',
        message: msg,
        type: 'danger',
      });
    } finally {
      setCancelling(false);
    }
  };

  return {
    order,
    loading,
    error,
    activeTrackingCode,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    currentStep,
    steps,
    isCancelled,
    isDeclined,
    secondsRemaining,
    formattedTimer,
    cancelling,
    handleCancelOrder,
    refetch: () => fetchOrder(activeTrackingCode),
  };
}

export default useOrderTracking;
