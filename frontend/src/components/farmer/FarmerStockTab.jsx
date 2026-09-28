import React from 'react';

/**
 * FarmerStockTab
 * Displays weekly stall produce stock with live quantity adjustments
 * and status toggles (In Stock, Low, Sold Out).
 */
export default function FarmerStockTab({ stockList, onAdjustStock, onToggleStockStatus }) {
  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Weekly Stall Produce Stock</h2>
          <p className="text-xs text-[#475569]">
            Adjust live quantities brought to market. Shoppers see real-time availability in the public catalog.
          </p>
        </div>
        <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          {stockList.length} Active Harvest Listings
        </span>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stockList.map((item) => (
          <div
            key={item.id}
            className="border border-[#E2E8DF] rounded-2xl p-4 bg-[#F8FAF6] space-y-4 hover:border-emerald-300 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E2E8DF]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">{item.name}</h4>
                  <p className="text-[11px] text-[#475569]">
                    {item.category} • {item.harvestWindow}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-[#16A34A]">
                ${Number(item.price || 0).toFixed(2)}/{item.unit}
              </span>
            </div>

            {/* Stock Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#475569]">Available:</span>
                <div className="inline-flex items-center border border-[#E2E8DF] rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onAdjustStock(item.id, -1)}
                    className="px-2.5 py-1 text-xs font-bold text-[#475569] hover:bg-slate-100 rounded-l-xl transition cursor-pointer"
                    aria-label="Decrease stock"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-[#0F172A] font-mono">
                    {item.stockQty} {item.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAdjustStock(item.id, 1)}
                    className="px-2.5 py-1 text-xs font-bold text-[#475569] hover:bg-slate-100 rounded-r-xl transition cursor-pointer"
                    aria-label="Increase stock"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status Pills */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleStockStatus(item.id, 'IN_STOCK')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    item.stockStatus === 'IN_STOCK'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-[#475569] border border-[#E2E8DF]'
                  }`}
                >
                  In Stock
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStockStatus(item.id, 'LOW_STOCK')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    item.stockStatus === 'LOW_STOCK'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-[#475569] border border-[#E2E8DF]'
                  }`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStockStatus(item.id, 'SOLD_OUT')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    item.stockStatus === 'SOLD_OUT'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-[#475569] border border-[#E2E8DF]'
                  }`}
                >
                  Sold Out
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
