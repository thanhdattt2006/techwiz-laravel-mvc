import React from 'react';
import { Store, Plus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import FarmerMarketCard from './FarmerMarketCard';
import FarmerMarketModal from './FarmerMarketModal';

/**
 * FarmerMarketsTab (Phase 4.14)
 * Market Stalls Configuration tab for managing registered market locations,
 * pickup time windows, slot intervals, and cutoff parameters.
 */
export default function FarmerMarketsTab({ hook }) {
  const {
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
    refetch,
  } = hook;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A]">Farmers Market Stalls</h2>
            <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {farmerMarkets.length} Stalls Linked
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Configure market locations where shoppers can pick up pre-ordered harvest crates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            className="p-2.5 rounded-xl border border-[#E2E8DF] text-slate-500 hover:text-[#16A34A] hover:bg-slate-50 transition cursor-pointer"
            title="Refresh stalls"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openLinkModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Link Market</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-xs text-[#475569] font-medium">Loading registered market stalls...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="underline font-bold hover:text-rose-900 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && farmerMarkets.length === 0 && (
        <div className="text-center py-12 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAF6] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#0F172A]">No market stalls registered</h4>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Your stall is not yet linked to any farmers market. Click "+ Link Market" above to set up your weekend pickup booth!
          </p>
        </div>
      )}

      {/* Markets Grid */}
      {!loading && !error && farmerMarkets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farmerMarkets.map((fm) => (
            <FarmerMarketCard
              key={fm.id || `${fm.farmer_id}-${fm.market_id}`}
              farmerMarket={fm}
              onEdit={openEditModal}
              onUnlink={handleUnlinkMarket}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <FarmerMarketModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSaveMarket}
        editingMarket={editingMarket}
        allMarkets={allMarkets}
        submitting={submitting}
      />
    </div>
  );
}
