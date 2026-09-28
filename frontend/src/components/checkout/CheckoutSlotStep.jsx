import React from 'react';
import { Clock, Loader2 } from 'lucide-react';

/**
 * CheckoutSlotStep
 * Step 3: Select pickup time slot with live cutoff availability indicator.
 */
export default function CheckoutSlotStep({
  slots,
  selectedSlot,
  onSelectSlot,
  loadingSlots,
  slotsError,
  selectedDate,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-[#16A34A]" />
          <span>3. Choose Pickup Time Slot</span>
        </label>
        {selectedDate && (
          <span className="text-[11px] text-[#475569]">
            For {selectedDate}
          </span>
        )}
      </div>

      {loadingSlots ? (
        <div className="p-8 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#16A34A] mx-auto" />
          <p className="text-xs text-[#475569]">
            Checking available pickup slots and cutoff deadlines...
          </p>
        </div>
      ) : slotsError ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {slotsError}
        </div>
      ) : slots.length === 0 ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
          <p className="font-bold">No active pickup slots found.</p>
          <p className="text-[11px]">
            The farmer may not have operational hours configured for this date, or the order cutoff time has already passed. Please select another date.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {slots.map((slot) => {
            const isSelected =
              selectedSlot &&
              selectedSlot.start_time === slot.start_time &&
              selectedSlot.end_time === slot.end_time;
            const isAvailable = slot.is_available;

            return (
              <button
                key={slot.label}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectSlot(slot)}
                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                  !isAvailable
                    ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                    : 'bg-white border-[#E2E8DF] text-[#0F172A] hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer'
                }`}
              >
                <span>{slot.label}</span>
                <span
                  className={`text-[9px] uppercase tracking-wider font-semibold ${
                    !isAvailable
                      ? 'text-rose-500'
                      : isSelected
                      ? 'text-emerald-100'
                      : 'text-[#16A34A]'
                  }`}
                >
                  {!isAvailable ? 'Cutoff Passed' : 'Available'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
