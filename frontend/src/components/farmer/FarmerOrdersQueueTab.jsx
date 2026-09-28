import React from 'react';
import { Search, ShoppingBag, Loader2, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import FarmerOrderCard from './FarmerOrderCard';
import DeclineOrderModal from './DeclineOrderModal';

/**
 * FarmerOrdersQueueTab (Phase 4.12)
 * Renders the live pre-order queue for farmer stalls with multi-status filtering,
 * live search, date filters, and State Machine transition actions.
 */
export default function FarmerOrdersQueueTab({ hook }) {
  const {
    filteredOrders,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
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
    refetch,
  } = hook;

  return (
    <div className="space-y-6">
      {/* Filters & Search Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            All Orders ({metrics.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PLACED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'PLACED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            New Review ({metrics.placed})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'ACCEPTED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Packing & Harvest ({metrics.accepted})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('READY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'READY'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Ready at Stall ({metrics.ready})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'COMPLETED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Completed ({metrics.completed})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('CANCELLED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'CANCELLED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Declined / Cancelled ({metrics.cancelled})
          </button>
        </div>

        {/* Search & Date Filter */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, customer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-white text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>

          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-white text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
              title="Filter by Pickup Date"
            />
          </div>
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              className="px-2 py-1 text-xs text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Queue List */}
      {loading ? (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-14 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#16A34A] mx-auto" />
          <p className="text-xs font-bold text-[#475569]">Loading live pre-order reservations...</p>
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
          <h3 className="text-base font-bold text-[#0F172A]">No Pre-Orders in this Category</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            {searchTerm || dateFilter
              ? 'No reservations matched your search query or pickup date.'
              : 'There are currently no customer pre-orders matching this status.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <FarmerOrderCard
              key={ord.id}
              order={ord}
              onAccept={handleAcceptOrder}
              onMarkReady={handleMarkReady}
              onComplete={handleCompleteOrder}
              onOpenDeclineModal={setDeclineTargetOrder}
              actionLoading={actionLoadingId === ord.id}
            />
          ))}
        </div>
      )}

      {/* Decline / Rejection Modal */}
      <DeclineOrderModal
        order={declineTargetOrder}
        onClose={() => setDeclineTargetOrder(null)}
        onConfirm={handleDeclineOrder}
        loading={Boolean(actionLoadingId)}
      />
    </div>
  );
}
