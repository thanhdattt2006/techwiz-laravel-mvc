import React from 'react';

const WEEK_DAYS = [
  { val: 0, label: 'Sun' },
  { val: 1, label: 'Mon' },
  { val: 2, label: 'Tue' },
  { val: 3, label: 'Wed' },
  { val: 4, label: 'Thu' },
  { val: 5, label: 'Fri' },
  { val: 6, label: 'Sat' },
];

/**
 * MarketPickupDaysPicker
 * Day of the week selection buttons for stall pickup schedule.
 */
export default function MarketPickupDaysPicker({ selectedDays = [], onToggleDay }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#0F172A] block">
        Market Pickup Operating Days *
      </label>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_DAYS.map((d) => {
          const isSelected = selectedDays.includes(d.val);
          return (
            <button
              key={d.val}
              type="button"
              onClick={() => onToggleDay(d.val)}
              className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isSelected
                  ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                  : 'bg-[#F8FAF6] text-[#475569] border-[#E2E8DF] hover:bg-slate-100'
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
