import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  AlertCircle,
  ShoppingBag,
  XCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useOrderTracking } from '../../hooks/useOrderTracking';
import {
  TrackerStepper,
  TrackerStallCard,
  TrackerReceiptCard,
  InspectionSlipModal,
} from '../../components/orders';
import { StatusBadge } from '../../components/common';

/**
 * OrderPickupTrackerPage (Phase 4.10)
 * Public and authenticated live pre-order tracking interface.
 * Connects directly to GET /api/v1/orders/track/{orderCode}.
 * Displays 4-step state machine lifecycle, interactive map coordinates,
 * and live cutoff cancellation controls adhering strictly to S.O.L.I.D & D.R.Y.
 */
export default function OrderPickupTrackerPage() {
  const {
    order,
    loading,
    error,
    activeTrackingCode,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    steps,
    isCancelled,
    isDeclined,
    secondsRemaining,
    formattedTimer,
    cancelling,
    handleCancelOrder,
    refetch,
  } = useOrderTracking();

  const [showSlipModal, setShowSlipModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8DF] pb-6">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#15803D] mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fresh Produce Catalog</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Pre-Order Pickup Tracker
            </h1>
            {order && <StatusBadge status={order.status} />}
          </div>
          {activeTrackingCode && (
            <p className="text-xs text-[#475569] mt-1 font-mono">
              Reservation Code: <strong className="text-[#0F172A]">{activeTrackingCode}</strong>
            </p>
          )}
        </div>

        {/* Quick Search Another Order */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Track code (e.g. ML-2026-...)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {/* Main Dynamic Area */}
      {loading ? (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#16A34A] mx-auto" />
          <p className="text-xs font-bold text-[#475569]">Retrieving live pre-order tracking status...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-rose-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0F172A]">Pre-Order Not Found</h3>
            <p className="text-xs text-[#475569] leading-relaxed">{error}</p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0F172A] transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      ) : !order ? (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">Enter Your Reservation Code</h3>
          <p className="text-xs text-[#475569]">
            Input your unique pre-order code (found on your confirmation pass or shopper history) to check real-time harvest and pickup status.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cancellation or Decline Notice Banner */}
          {(isCancelled || isDeclined) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-in fade-in">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-rose-900">
                  {isDeclined ? 'Pre-Order Declined by Farmer' : 'Pre-Order Cancelled'}
                </h4>
                <p className="leading-relaxed">
                  {order.cancel_reason
                    ? `Reason: "${order.cancel_reason}"`
                    : 'This order has been cancelled and is no longer active for market pickup.'}
                </p>
                {order.cancelled_at && (
                  <p className="text-[11px] text-rose-700">
                    Timestamp: {new Date(order.cancelled_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 4-Step Interactive Stepper */}
          <TrackerStepper
            steps={steps}
            isCancelled={isCancelled}
            isDeclined={isDeclined}
            secondsRemaining={secondsRemaining}
            formattedTimer={formattedTimer}
            status={order.status}
          />

          {/* 2-Column Grid: Stall Directions & Receipt */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <TrackerStallCard order={order} />
            </div>

            <div className="lg:col-span-5">
              <TrackerReceiptCard
                order={order}
                onPrintPass={() => setShowSlipModal(true)}
                onCancelOrder={handleCancelOrder}
                cancelling={cancelling}
              />
            </div>
          </div>
        </div>
      )}

      {/* Itemized Pass & Slip Modal */}
      {order && (
        <InspectionSlipModal
          order={order}
          onClose={() => setShowSlipModal(false)}
        />
      )}
    </div>
  );
}
