import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * CheckoutDateStep
 * Step 2: Select market day matching the stall's pickup calendar.
 */
export default function CheckoutDateStep({
  availableDates,
  selectedDate,
  onSelectDate,
  cutoffHours,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-[#16A34A]" />
          <span>2. Select Market Day</span>
        </label>
        {cutoffHours && (
          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Cutoff: {cutoffHours}h prior
          </span>
        )}
      </div>

      {availableDates.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#475569]">
          Please choose a market above to view scheduled market dates.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {availableDates.map((dateObj) => {
            const isSelected = dateObj.dateStr === selectedDate;
            return (
              <button
                key={dateObj.dateStr}
                type="button"
                onClick={() => onSelectDate(dateObj.dateStr)}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-md shadow-emerald-700/20'
                    : 'bg-white border-[#E2E8DF] hover:bg-emerald-50/50 hover:border-emerald-300 text-[#0F172A]'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-emerald-100' : 'text-[#475569]'
                  }`}
                >
                  {dateObj.relativeLabel}
                </span>
                <span className="text-xs font-black">
                  {dateObj.dayName}
                </span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-emerald-700/50 text-white'
                      : 'bg-slate-100 text-[#475569]'
                  }`}
                >
                  {dateObj.monthDay}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
