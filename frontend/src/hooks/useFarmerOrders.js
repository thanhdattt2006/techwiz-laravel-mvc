import { useState, useEffect, useCallback, useMemo } from 'react';
import orderApi from '../api/orderApi';
import { useModal } from '../context/ModalContext';

/**
 * useFarmerOrders Custom Hook (Phase 4.12)
 * Encapsulates pre-order queue management, filtering, searching,
 * and 4-step state machine transitions (accept, ready, complete, decline).
 */
export function useFarmerOrders() {
  const { showAlert, showConfirm } = useModal();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [marketFilter, setMarketFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Active action tracking
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [declineTargetOrder, setDeclineTargetOrder] = useState(null);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getFarmerOrders();
      const list = res?.data?.data || res?.data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to retrieve farmer pre-order queue.';
      setError(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Transition 1: Accept Order (placed -> accepted)
  const handleAcceptOrder = useCallback(
    async (orderId) => {
      setActionLoadingId(orderId);
      try {
        await orderApi.acceptOrder(orderId);
        showAlert({
          title: 'Pre-Order Accepted',
          message: 'Order reservation confirmed! Customer notified to expect harvest on market day.',
          type: 'success',
          autoCloseMs: 2000,
        });
        await fetchOrders();
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to accept pre-order.';
        showAlert({ title: 'Action Failed', message: msg, type: 'danger' });
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchOrders, showAlert]
  );

  // Transition 2: Mark Ready at Stall (accepted -> ready_for_pickup)
  const handleMarkReady = useCallback(
    async (orderId) => {
      setActionLoadingId(orderId);
      try {
        await orderApi.markOrderReady(orderId);
        showAlert({
          title: 'Order Ready for Pickup',
          message: 'Order crate tagged and staged at stall. Customer notified that harvest is ready.',
          type: 'success',
          autoCloseMs: 2000,
        });
        await fetchOrders();
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to mark order ready.';
        showAlert({ title: 'Action Failed', message: msg, type: 'danger' });
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchOrders, showAlert]
  );

  // Transition 3: Complete Order (ready_for_pickup -> completed)
  const handleCompleteOrder = useCallback(
    async (order) => {
      const confirmed = await showConfirm({
        title: 'Confirm Stall Cash Settlement?',
        message: `Confirm that customer ${order.customer?.fullname || 'Customer'} inspected their produce crate and settled $${Number(order.total_amount || 0).toFixed(2)} USD in cash/card at the stall?`,
        confirmText: 'Yes, Settle & Complete',
        cancelText: 'Cancel',
        type: 'success',
      });

      if (!confirmed) return;

      setActionLoadingId(order.id);
      try {
        await orderApi.completeOrder(order.id);
        showAlert({
          title: 'Order Completed & Cash Cleared',
          message: `Order #${order.order_code} completed. Zero online fees applied.`,
          type: 'success',
          autoCloseMs: 2200,
        });
        await fetchOrders();
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to complete order.';
        showAlert({ title: 'Action Failed', message: msg, type: 'danger' });
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchOrders, showAlert, showConfirm]
  );

  // Transition 4: Decline Order (placed/accepted -> declined)
  const handleDeclineOrder = useCallback(
    async (orderId, reason) => {
      setActionLoadingId(orderId);
      try {
        await orderApi.declineOrder(orderId, reason);
        showAlert({
          title: 'Pre-Order Declined',
          message: 'Order declined. Produce inventory was automatically restored to stall stock.',
          type: 'info',
          autoCloseMs: 2200,
        });
        setDeclineTargetOrder(null);
        await fetchOrders();
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to decline pre-order.';
        showAlert({ title: 'Decline Failed', message: msg, type: 'danger' });
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchOrders, showAlert]
  );

  // Filtered orders pipeline
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'PLACED') matchesStatus = ord.status === 'placed';
      else if (statusFilter === 'ACCEPTED') matchesStatus = ord.status === 'accepted';
      else if (statusFilter === 'READY') matchesStatus = ord.status === 'ready_for_pickup';
      else if (statusFilter === 'COMPLETED') matchesStatus = ord.status === 'completed';
      else if (statusFilter === 'CANCELLED') matchesStatus = ord.status === 'cancelled' || ord.status === 'declined';
      else if (statusFilter === 'ACTIVE') {
        matchesStatus = ord.status === 'placed' || ord.status === 'accepted' || ord.status === 'ready_for_pickup';
      }

      // Search filter
      const q = searchTerm.trim().toLowerCase();
      const code = (ord.order_code || '').toLowerCase();
      const customerName = (ord.customer?.fullname || '').toLowerCase();
      const customerPhone = (ord.customer?.phone || '').toLowerCase();
      const matchesSearch = !q || code.includes(q) || customerName.includes(q) || customerPhone.includes(q);

      // Market filter
      const matchesMarket = !marketFilter || String(ord.market_id) === String(marketFilter);

      // Date filter
      const matchesDate = !dateFilter || ord.pickup_date === dateFilter;

      return matchesStatus && matchesSearch && matchesMarket && matchesDate;
    });
  }, [orders, statusFilter, searchTerm, marketFilter, dateFilter]);

  // Operational metrics
  const metrics = useMemo(() => {
    let placed = 0;
    let accepted = 0;
    let ready = 0;
    let completed = 0;
    let cancelled = 0;
    let activeCash = 0;
    let collectedCash = 0;

    orders.forEach((o) => {
      const amt = Number(o.total_amount || 0);
      if (o.status === 'placed') {
        placed++;
        activeCash += amt;
      } else if (o.status === 'accepted') {
        accepted++;
        activeCash += amt;
      } else if (o.status === 'ready_for_pickup') {
        ready++;
        activeCash += amt;
      } else if (o.status === 'completed') {
        completed++;
        collectedCash += amt;
      } else if (o.status === 'cancelled' || o.status === 'declined') {
        cancelled++;
      }
    });

    return {
      all: orders.length,
      placed,
      accepted,
      ready,
      completed,
      cancelled,
      activeCount: placed + accepted + ready,
      activeCash,
      collectedCash,
    };
  }, [orders]);

  return {
    orders,
    filteredOrders,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    marketFilter,
    setMarketFilter,
    dateFilter,
    setDateFilter,
    actionLoadingId,
    declineTargetOrder,
    setDeclineTargetOrder,
    handleAcceptOrder,
    handleMarkReady,
    handleCompleteOrder,
    handleDeclineOrder,
    metrics,
    refetch: fetchOrders,
  };
}

export default useFarmerOrders;
