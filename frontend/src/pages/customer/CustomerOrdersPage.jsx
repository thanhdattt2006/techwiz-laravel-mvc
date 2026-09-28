import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  Receipt,
  Search,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useCustomerOrders } from '../../hooks/useCustomerOrders';
import { CustomerOrderCard, InspectionSlipModal } from '../../components/orders';
import { ReviewModal } from '../../components/common';

/**
 * CustomerOrdersPage (Phase 4.10)
 * Live pre-order reservation manager with real-time status tracking,
 * itemized inspection slips, cutoff-guarded cancellations, and multi-status filtering.
 * Cleanly decomposed according to S.O.L.I.D and D.R.Y principles.
 */
export default function CustomerOrdersPage() {
  const {
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
    refetch,
  } = useCustomerOrders();

  const [selectedReviewOrder, setSelectedReviewOrder] = React.useState(null);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <Receipt className="w-3.5 h-3.5" />
            <span>Order History & In-Person Cash Settlement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            My Pre-Order Reservations
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Review all stall pickup passes, inspect reserved crate items, and access itemized inspection slips for cash settlement.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition self-start md:self-center"
        >
          <Store className="w-4 h-4" />
          <span>New Pre-Order</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'ALL'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            All Orders ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'ACTIVE'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Active & Ready ({counts.active})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'COMPLETED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Completed ({counts.completed})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('CANCELLED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'CANCELLED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Cancelled ({counts.cancelled})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code, stall, or market..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8DF] bg-white text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#16A34A] mx-auto" />
          <p className="text-xs font-bold text-[#475569]">Loading your pre-orders...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">{error}</h3>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#475569] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">No Pre-Orders Found</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            {searchTerm
              ? 'No reservations matched your search query. Try searching for a different keyword or reset filters.'
              : 'No reservations found in this category. Browse weekly seasonal harvests to place your next stall pre-order!'}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition"
          >
            <span>Explore Produce Catalog</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <CustomerOrderCard
              key={ord.id}
              order={ord}
              onOpenSlip={setSelectedSlipOrder}
              onOpenReview={setSelectedReviewOrder}
              onCancelOrder={cancelOrder}
              isCancelling={cancellingId === ord.id}
            />
          ))}
        </div>
      )}

      {/* Itemized Cash Inspection Slip Modal */}
      <InspectionSlipModal
        order={selectedSlipOrder}
        onClose={() => setSelectedSlipOrder(null)}
      />

      {/* 5-Star Harvest Review Modal */}
      <ReviewModal
        isOpen={Boolean(selectedReviewOrder)}
        order={selectedReviewOrder}
        onClose={() => setSelectedReviewOrder(null)}
        onSuccess={refetch}
      />
    </div>
  );
}
