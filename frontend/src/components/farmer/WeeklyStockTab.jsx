import React from 'react';
import { Calendar, RefreshCw, Loader2, Sparkles, Sprout, AlertCircle } from 'lucide-react';
import WeeklyStockTemplateForm from './WeeklyStockTemplateForm';

/**
 * WeeklyStockTab (Phase 4.13)
 * Provides 7-day recurring stock quota configuration and 1-Click bulk rollover
 * into the live market stall catalog.
 */
export default function WeeklyStockTab({ hook, products = [] }) {
  const {
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
    templates,
    loadingTemplates,
    savingTemplates,
    applyingWeekly,
    targetApplyDay,
    setTargetApplyDay,
    handleUpdateDay,
    handleSaveTemplates,
    handleApplyWeeklyStock,
    DAYS_OF_WEEK,
  } = hook;

  if (products.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
          <Sprout className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#0F172A]">No Produce Items Available</h3>
        <p className="text-xs text-[#475569] max-w-md mx-auto">
          Please create harvest listings in the "Stall Stock" tab first before configuring recurring weekly quotas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Top 1-Click Rollover Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-[#0F172A] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automated Dawn Harvest Rollover</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              1-Click Weekly Stock Rollover
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Instantly replenish your stall's public pre-order stock for the upcoming market session based on your recurring 7-day quotas.
            </p>
          </div>

          {/* Action Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4.5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="space-y-1">
              <label htmlFor="target-day-select" className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
                Target Market Day
              </label>
              <select
                id="target-day-select"
                value={targetApplyDay}
                onChange={(e) => setTargetApplyDay(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-slate-900/80 text-white border border-white/20 text-xs font-bold focus:outline-hidden"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d.day_of_week} value={d.day_of_week} className="bg-slate-900 text-white">
                    {d.day_name} {d.day_of_week === 0 || d.day_of_week === 6 ? '(Market Day)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={applyingWeekly}
              onClick={() => handleApplyWeeklyStock()}
              className="sm:self-end px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-500 text-white text-xs font-black shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {applyingWeekly ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying Quotas...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Apply to Live Catalog</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Product Selector & 7-Day Schedule Editor */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Product Selector Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Configure 7-Day Harvest Template</h3>
            <p className="text-xs text-[#475569]">
              Select a crop below to adjust weekly quotas for each day of the week.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="produce-picker-select" className="text-xs font-bold text-[#475569]">
              Crop:
            </label>
            <select
              id="produce-picker-select"
              value={selectedProductId || ''}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="px-3.5 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-bold text-[#0F172A] focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({Number(p.stock_quantity || 0)} {p.unit} in stock)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Product Summary Card */}
        {selectedProduct && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF]">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.image || '/images/categories/fresh-vegetables.webp'}
                alt={selectedProduct.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#E2E8DF]"
              />
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">{selectedProduct.name}</h4>
                <p className="text-[11px] text-[#475569]">
                  Current Live Stock: <span className="font-mono font-bold text-[#16A34A]">{selectedProduct.stock_quantity} {selectedProduct.unit}</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              ${Number(selectedProduct.price || 0).toFixed(2)} / {selectedProduct.unit}
            </span>
          </div>
        )}

        {/* Template Form */}
        {loadingTemplates ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-[#16A34A] animate-spin mx-auto" />
            <p className="text-xs text-[#475569]">Loading weekly schedule...</p>
          </div>
        ) : (
          <WeeklyStockTemplateForm
            templates={templates}
            onUpdateDay={handleUpdateDay}
            onSave={handleSaveTemplates}
            saving={savingTemplates}
            productName={selectedProduct?.name || ''}
            unit={selectedProduct?.unit || 'kg'}
          />
        )}
      </div>
    </div>
  );
}
