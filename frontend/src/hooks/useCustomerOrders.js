import { useState, useEffect, useCallback, useMemo } from 'react';
import orderApi from '../api/orderApi';
import { useModal } from '../context/ModalContext';

/**
 * Custom Hook: useCustomerOrders
 * Encapsulates pre-order history retrieval, multi-status filtering,
 * search querying, and customer cancellations following S.O.L.I.D.
 */
export function useCustomerOrders() {
  const { showAlert, showConfirm } = useModal();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterTab, setFilterTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlipOrder, setSelectedSlipOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getMyOrders();
      const list = res?.data?.data || res?.data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to retrieve your pre-orders.';
      setError(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Tab counts
  const counts = useMemo(() => {
    let active = 0;
    let completed = 0;
    let cancelled = 0;

    orders.forEach((ord) => {
      const st = ord.status;
      if (st === 'placed' || st === 'accepted' || st === 'ready_for_pickup') {
        active++;
      } else if (st === 'completed') {
        completed++;
      } else if (st === 'cancelled' || st === 'declined') {
        cancelled++;
      }
    });

    return {
      all: orders.length,
      active,
      completed,
      cancelled,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const st = ord.status;
      let matchesFilter = true;

      if (filterTab === 'ACTIVE') {
        matchesFilter = st === 'placed' || st === 'accepted' || st === 'ready_for_pickup';
      } else if (filterTab === 'COMPLETED') {
        matchesFilter = st === 'completed';
      } else if (filterTab === 'CANCELLED') {
        matchesFilter = st === 'cancelled' || st === 'declined';
      }

      const q = searchTerm.trim().toLowerCase();
      if (!q) return matchesFilter;

      const code = (ord.order_code || '').toLowerCase();
      const marketName = (ord.market?.name || '').toLowerCase();
      const farmerName = (ord.farmer?.stall_name || '').toLowerCase();

      return matchesFilter && (code.includes(q) || marketName.includes(q) || farmerName.includes(q));
    });
  }, [orders, filterTab, searchTerm]);

  // Cancel order handler
  const cancelOrder = useCallback(
    async (order) => {
      if (!order || !order.can_be_cancelled) {
        showAlert({
          title: 'Cannot Cancel Order',
          message: 'This pre-order can no longer be cancelled because the cutoff deadline has passed.',
          type: 'warning',
        });
        return;
      }

      const confirmed = await showConfirm({
        title: 'Cancel Pre-Order Reservation?',
        message: `Are you sure you want to cancel order #${order.order_code}? The reserved produce will be returned to the farmer stall inventory.`,
        confirmText: 'Yes, Cancel Pre-Order',
        cancelText: 'Keep Pre-Order',
        type: 'warning',
      });

      if (!confirmed) return;

      setCancellingId(order.id);
      try {
        await orderApi.cancelOrder(order.id, 'Cancelled by customer via Shopper Hub');
        showAlert({
          title: 'Pre-Order Cancelled',
          message: `Order #${order.order_code} was successfully cancelled. Zero fees incurred.`,
          type: 'success',
        });
        await fetchOrders();
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to cancel the pre-order.';
        showAlert({
          title: 'Cancellation Failed',
          message: msg,
          type: 'danger',
        });
      } finally {
        setCancellingId(null);
      }
    },
    [showAlert, showConfirm, fetchOrders]
  );

  return {
    orders,
    filteredOrders,
    loading,
    error,
    filterTab,
    setFilterTab,
    searchTerm,
    setSearchTerm,
    selectedSlipOrder,
    setSelectedSlipOrder,
    cancellingId,
    cancelOrder,
    counts,
    refetch: fetchOrders,
  };
}

export default useCustomerOrders;
