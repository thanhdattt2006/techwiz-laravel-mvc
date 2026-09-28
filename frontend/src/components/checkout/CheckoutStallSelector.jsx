import React from 'react';
import { Sprout } from 'lucide-react';

/**
 * CheckoutStallSelector
 * Renders the stall tab switcher (if multiple stalls exist in cart)
 * and active stall summary banner for PreOrderCheckoutModal.
 */
export default function CheckoutStallSelector({
  cartStalls,
  selectedStallIndex,
  onSelectStallIndex,
  activeStall,
  stallItems,
  stallSubtotal,
  initialStall,
}) {
  return (
    <>
      {/* Stall Switcher (if multiple stalls exist in cart and none fixed) */}
      {!initialStall && cartStalls.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
            Select Stall to Schedule Pickup:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cartStalls.map((stallItem, idx) => (
              <button
                key={stallItem.farmer_id}
                type="button"
                onClick={() => onSelectStallIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  selectedStallIndex === idx
                    ? 'bg-emerald-50 border-[#16A34A] text-[#15803D] shadow-2xs'
                    : 'bg-white border-[#E2E8DF] text-[#475569] hover:bg-slate-50'
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>{stallItem.stall_name}</span>
                <span className="text-[11px] font-mono bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">
                  ${Number(stallItem.stall_subtotal).toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stall & Basket Summary Banner */}
      {activeStall && (
        <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#0F172A]">
                {activeStall.stall_name}
              </h4>
              <p className="text-xs text-[#475569]">
                {stallItems.length} {stallItems.length === 1 ? 'item' : 'items'} in pre-order basket
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#475569] block font-bold uppercase tracking-wider">
              Stall Amount
            </span>
            <span className="text-lg font-black text-[#16A34A]">
              ${stallSubtotal}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
