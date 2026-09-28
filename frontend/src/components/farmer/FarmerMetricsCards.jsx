import React from 'react';
import { ShoppingBag, DollarSign, Package, CheckCircle2 } from 'lucide-react';

/**
 * FarmerMetricsCards
 * Displays real-time operational stall metrics:
 * active queue count, cash pending, crates ready, and cash cleared.
 */
export default function FarmerMetricsCards({ metrics }) {
  const {
    activeCount = 0,
    activeCash = 0,
    ready = 0,
    completed = 0,
    collectedCash = 0,
  } = metrics || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Queue */}
      <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Active Queue</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{activeCount}</span>
          <span className="text-xs text-[#16A34A] font-bold ml-2">Crates held</span>
        </div>
        <p className="text-[11px] text-[#475569] mt-1">Pending in-person pickup</p>
      </div>

      {/* 2. Stall Cash Pending */}
      <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Stall Cash Total</span>
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            ${Number(activeCash || 0).toFixed(2)}
          </span>
          <span className="text-xs text-blue-600 font-bold ml-2">USD</span>
        </div>
        <p className="text-[11px] text-[#475569] mt-1">Expected at booth handover</p>
      </div>

      {/* 3. Ready at Booth */}
      <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Ready at Booth</span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{ready}</span>
          <span className="text-xs text-amber-600 font-bold ml-2">Packed</span>
        </div>
        <p className="text-[11px] text-[#475569] mt-1">Waiting for customer arrival</p>
      </div>

      {/* 4. Cash Cleared */}
      <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Cash Cleared</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            ${Number(collectedCash || 0).toFixed(2)}
          </span>
          <span className="text-xs text-[#16A34A] font-bold ml-2">Collected</span>
        </div>
        <p className="text-[11px] text-[#475569] mt-1">{completed} orders settled in-person</p>
      </div>
    </div>
  );
}
