import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

/**
 * FilterSidebar Component
 * Reusable multi-criteria filter panel for Produce Catalog and Marketplace search.
 */
export default function FilterSidebar({
  searchTerm = '',
  onSearchChange = () => {},
  categories = [],
  selectedCategory = 'ALL',
  onCategoryChange = () => {},
  markets = [],
  selectedMarket = 'ALL',
  onMarketChange = () => {},
  maxPrice = 15,
  onMaxPriceChange = () => {},
  priceLimit = 20,
  organicOnly = false,
  onOrganicOnlyChange = () => {},
  inStockOnly = false,
  onInStockOnlyChange = () => {},
  onResetFilters = () => {},
  hasActiveFilters = false,
  className = '',
}) {
  return (
    <div className={`bg-white border border-[#E2E8DF] rounded-2xl p-6 shadow-xs space-y-6 ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#16A34A]" />
          <h3 className="text-sm font-bold text-[#0F172A]">Filter Harvest</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-[#DC2626] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0F172A]">Keyword Search</label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#475569] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Produce or farm name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
          />
        </div>
      </div>

      {/* 2. Category Selector */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0F172A]">Category</label>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onCategoryChange('ALL')}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-50 text-[#16A34A] font-bold'
                  : 'text-[#475569] hover:bg-slate-50'
              }`}
            >
              <span>All Categories</span>
            </button>
            {categories.map((cat) => {
              const catLabel = typeof cat === 'object' ? cat.name : cat;
              const catValue = typeof cat === 'object' ? (cat.slug || cat.name) : cat;
              const isSelected =
                selectedCategory === catValue ||
                (typeof cat === 'object' && (selectedCategory === cat.name || String(selectedCategory) === String(cat.id)));

              return (
                <button
                  key={typeof cat === 'object' ? cat.id : cat}
                  type="button"
                  onClick={() => onCategoryChange(catValue)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 text-[#16A34A] font-bold'
                      : 'text-[#475569] hover:bg-slate-50'
                  }`}
                >
                  <span>{catLabel}</span>
                  {typeof cat === 'object' && cat.products_count !== undefined && (
                    <span className="text-[10px] text-[#475569] bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {cat.products_count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Market Location Dropdown */}
      {markets.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A]">Pickup Farmers Market</label>
          <select
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            className="w-full text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#16A34A] cursor-pointer"
          >
            <option value="ALL">All Chicago Weekend Markets</option>
            {markets.map((m) => {
              const id = typeof m === 'object' ? m.id : m;
              const name = typeof m === 'object' ? m.name : m;
              const neighborhood = typeof m === 'object' && m.neighborhood ? ` (${m.neighborhood})` : '';
              return (
                <option key={id} value={id}>
                  {name}{neighborhood}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* 4. Price Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0F172A]">Max Price / Unit</span>
          <span className="font-extrabold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-md">
            ${Number(maxPrice).toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max={priceLimit}
          step="0.5"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(parseFloat(e.target.value))}
          className="w-full accent-[#16A34A] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#475569]">
          <span>$1.00</span>
          <span>${priceLimit}.00</span>
        </div>
      </div>

      {/* 5. Checkbox Filters */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-[#0F172A]">
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => onOrganicOnlyChange(e.target.checked)}
            className="rounded text-[#16A34A] focus:ring-[#16A34A] cursor-pointer"
          />
          <span>USDA Organic Certified Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer font-medium text-[#0F172A]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockOnlyChange(e.target.checked)}
            className="rounded text-[#16A34A] focus:ring-[#16A34A] cursor-pointer"
          />
          <span>In Stock for Weekend Pickup Only</span>
        </label>
      </div>
    </div>
  );
}
