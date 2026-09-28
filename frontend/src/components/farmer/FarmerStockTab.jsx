import React from 'react';
import { Search, Plus, Sprout, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import FarmerProductCard from './FarmerProductCard';
import FarmerProductModal from './FarmerProductModal';

/**
 * FarmerStockTab (Phase 4.13)
 * Full Produce Inventory CRUD tab connected directly to Backend APIs.
 */
export default function FarmerStockTab({ hook }) {
  const {
    products,
    categories,
    filteredProducts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    availabilityFilter,
    setAvailabilityFilter,
    actionLoadingId,
    modalOpen,
    editingProduct,
    submitting,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSaveProduct,
    handleDeleteProduct,
    handleQuickAdjustStock,
    handleQuickToggleAvailability,
    refetch,
  } = hook;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A]">Stall Produce Inventory</h2>
            <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {products.length} Items Listed
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage live harvest quantities and pricing. Changes reflect immediately in the public catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            className="p-2.5 rounded-xl border border-[#E2E8DF] text-slate-500 hover:text-[#16A34A] hover:bg-slate-50 transition cursor-pointer"
            title="Refresh inventory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Produce</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop name or harvest note..."
            className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          />
        </div>

        {/* Category & Availability Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          >
            <option value="ALL">All Availability</option>
            <option value="available">Available Only</option>
            <option value="sold_out">Sold Out Only</option>
            <option value="unavailable">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-xs text-[#475569] font-medium">Loading stall inventory from server...</p>
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
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-12 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAF6] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#0F172A]">No produce items found</h4>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            {products.length === 0
              ? 'You have not listed any produce items yet. Click "+ Add Produce" above to create your first crop listing!'
              : 'No items match your filter criteria. Try clearing the search or category filter.'}
          </p>
        </div>
      )}

      {/* Produce Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <FarmerProductCard
              key={product.id}
              product={product}
              onEdit={openEditModal}
              onDelete={handleDeleteProduct}
              onAdjustStock={handleQuickAdjustStock}
              onToggleAvailability={handleQuickToggleAvailability}
              loadingId={actionLoadingId}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <FarmerProductModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        submitting={submitting}
      />
    </div>
  );
}
