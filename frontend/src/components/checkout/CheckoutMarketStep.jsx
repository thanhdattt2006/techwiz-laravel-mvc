import React from 'react';
import { Store, MapPin, Check } from 'lucide-react';

const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * CheckoutMarketStep
 * Step 1: Select farmers market location where the stall operates.
 */
export default function CheckoutMarketStep({
  availableMarkets,
  selectedMarketId,
  onSelectMarket,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wider">
          <Store className="w-4 h-4 text-[#16A34A]" />
          <span>1. Choose Farmers Market Location</span>
        </label>
        <span className="text-[11px] text-[#475569]">
          {availableMarkets.length} {availableMarkets.length === 1 ? 'Market' : 'Markets'} Available
        </span>
      </div>

      {availableMarkets.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
          This stall currently does not have active market registrations configured.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableMarkets.map((m) => {
            const isSelected = String(m.id) === String(selectedMarketId);
            let daysList = m.pickup_days;
            if (typeof daysList === 'string') {
              try { daysList = JSON.parse(daysList); } catch { daysList = []; }
            }
            const daysStr = Array.isArray(daysList) && daysList.length > 0
              ? daysList.map((d) => SHORT_DAY_NAMES[d] || d).join(', ')
              : 'Weekends';

            return (
              <div
                key={m.id}
                onClick={() => onSelectMarket(String(m.id))}
                className={`p-3.5 rounded-2xl border transition cursor-pointer text-left space-y-1.5 ${
                  isSelected
                    ? 'bg-emerald-50/70 border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-2xs'
                    : 'bg-white border-[#E2E8DF] hover:bg-slate-50/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h5 className="text-xs font-black text-[#0F172A] leading-snug">
                    {m.name}
                  </h5>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#16A34A] bg-[#16A34A] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                </div>

                <p className="text-[11px] text-[#475569] flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{m.address}</span>
                </p>

                <div className="flex items-center gap-2 pt-1 text-[10px] text-[#475569]">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                    {m.stall_location || 'Stall Booth'}
                  </span>
                  <span className="text-[#15803D] font-bold">
                    Pickup: {daysStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
