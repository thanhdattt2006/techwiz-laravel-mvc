import { useState, useEffect, useMemo, useCallback } from 'react';
import orderApi from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { getUpcomingPickupDates } from '../utils/pickupCalendar';


/**
 * Custom Hook: usePreOrderCheckout
 * Encapsulates stall selection, market selection, slot retrieval, cutoff validation,
 * and order submission conforming strictly to S.O.L.I.D and D.R.Y.
 */
export function usePreOrderCheckout({ isOpen, initialStall = null, onOrderSuccess = null }) {
  const { cart, refreshCart, closeCart } = useCart();
  const { showAlert } = useModal();

  const cartStalls = useMemo(() => (Array.isArray(cart?.stalls) ? cart.stalls : []), [cart]);
  const [selectedStallIndex, setSelectedStallIndex] = useState(0);

  const activeStall = useMemo(() => {
    if (initialStall) return initialStall;
    if (cartStalls.length > 0) {
      return cartStalls[selectedStallIndex] || cartStalls[0];
    }
    return null;
  }, [initialStall, cartStalls, selectedStallIndex]);

  // Selections
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState('');

  // Slots fetching state
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [placedOrders, setPlacedOrders] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Available markets
  const availableMarkets = useMemo(() => {
    if (!activeStall) return [];
    return Array.isArray(activeStall.markets) ? activeStall.markets : [];
  }, [activeStall]);

  const activeMarket = useMemo(() => {
    if (!selectedMarketId) return null;
    return availableMarkets.find((m) => String(m.id) === String(selectedMarketId)) || null;
  }, [availableMarkets, selectedMarketId]);

  // Default market selection
  useEffect(() => {
    if (availableMarkets.length > 0 && !selectedMarketId) {
      setSelectedMarketId(String(availableMarkets[0].id));
    }
  }, [availableMarkets, selectedMarketId]);

  // Available dates
  const availableDates = useMemo(() => {
    if (!activeMarket) return [];
    const pickupDays = activeMarket.pickup_days || [];
    return getUpcomingPickupDates(pickupDays, 8);
  }, [activeMarket]);

  // Default date selection
  useEffect(() => {
    if (availableDates.length > 0) {
      const exists = availableDates.some((d) => d.dateStr === selectedDate);
      if (!exists) {
        setSelectedDate(availableDates[0].dateStr);
      }
    } else {
      setSelectedDate('');
    }
  }, [availableDates, selectedDate]);

  // Fetch slots from API
  const fetchSlots = useCallback(async () => {
    if (!activeStall || !selectedMarketId || !selectedDate) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot(null);

    try {
      const res = await orderApi.getPickupSlots({
        farmer_id: activeStall.farmer_id,
        market_id: selectedMarketId,
        pickup_date: selectedDate,
      });

      const slotList = res?.data?.data?.slots || [];
      setSlots(slotList);

      const firstAvailable = slotList.find((s) => s.is_available);
      if (firstAvailable) {
        setSelectedSlot(firstAvailable);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unable to retrieve pickup time slots.';
      setSlotsError(msg);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [activeStall, selectedMarketId, selectedDate]);

  useEffect(() => {
    if (isOpen && activeStall && selectedMarketId && selectedDate) {
      fetchSlots();
    }
  }, [isOpen, activeStall, selectedMarketId, selectedDate, fetchSlots]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setPlacedOrders(null);
      setErrorMessage(null);
      setCopiedCode(null);
      setNote('');
    }
  }, [isOpen]);

  // Confirm Pre-Order
  const handleConfirmPreOrder = async () => {
    if (!activeStall) {
      setErrorMessage('No stall selected for checkout.');
      return;
    }
    if (!selectedMarketId) {
      setErrorMessage('Please select a farmers market for stall pickup.');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('Please select a pickup date.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Please select an available pickup time slot.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      market_id: Number(selectedMarketId),
      pickup_date: selectedDate,
      pickup_start_time: selectedSlot.start_time,
      pickup_end_time: selectedSlot.end_time,
      note: note.trim() || undefined,
      farmer_id: activeStall.farmer_id,
    };

    try {
      const res = await orderApi.checkout(payload);
      const orders = res?.data?.data || [];
      const ordersList = Array.isArray(orders) ? orders : [orders];
      setPlacedOrders(ordersList);

      await refreshCart();
      closeCart();

      if (typeof onOrderSuccess === 'function') {
        onOrderSuccess(ordersList);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Unable to process your pre-order reservation. Please review pickup time or stock availability.';
      setErrorMessage(msg);
      showAlert({
        title: 'Pre-Order Checkout Failed',
        message: msg,
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const stallSubtotal = activeStall?.stall_subtotal
    ? Number(activeStall.stall_subtotal).toFixed(2)
    : '0.00';

  const stallItems = Array.isArray(activeStall?.items) ? activeStall.items : [];

  return {
    cartStalls,
    selectedStallIndex,
    setSelectedStallIndex,
    activeStall,
    availableMarkets,
    activeMarket,
    selectedMarketId,
    setSelectedMarketId,
    availableDates,
    selectedDate,
    setSelectedDate,
    slots,
    selectedSlot,
    setSelectedSlot,
    loadingSlots,
    slotsError,
    note,
    setNote,
    submitting,
    errorMessage,
    placedOrders,
    copiedCode,
    handleCopyCode,
    handleConfirmPreOrder,
    stallSubtotal,
    stallItems,
  };
}

export default usePreOrderCheckout;
