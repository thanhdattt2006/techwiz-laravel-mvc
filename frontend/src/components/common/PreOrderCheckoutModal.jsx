import React from 'react';
import {
  X,
  Calendar,
  Sprout,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { usePreOrderCheckout } from '../../hooks/usePreOrderCheckout';
import {
  CheckoutMarketStep,
  CheckoutDateStep,
  CheckoutSlotStep,
  CheckoutSuccessView,
  CheckoutStallSelector,
} from '../checkout';

/**
 * PreOrderCheckoutModal
 * Orchestrates multi-step stall pickup checkout following S.O.L.I.D and D.R.Y principles.
 * Data-fetching, calendar calculation, and API submission are delegated to usePreOrderCheckout hook.
 * Each checkout phase is rendered via dedicated, decoupled subcomponents.
 */
export default function PreOrderCheckoutModal({
  isOpen,
  onClose,
  stall: initialStall = null,
  onOrderSuccess = null,
}) {
  const {
    cartStalls,
    selectedStallIndex,
    setSelectedStallIndex,
    activeStall,
    availableMarkets,
    activeMarket,
    selectedMarketId,
    setSelectedMarketId,
    availableDates,
    selectedDate,
    setSelectedDate,
    slots,
    selectedSlot,
    setSelectedSlot,
    loadingSlots,
    slotsError,
    note,
    setNote,
    submitting,
    errorMessage,
    placedOrders,
    copiedCode,
    handleCopyCode,
    handleConfirmPreOrder,
    stallSubtotal,
    stallItems,
  } = usePreOrderCheckout({ isOpen, initialStall, onOrderSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Dark backdrop with blur */}
      <div
        onClick={submitting ? undefined : onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
        aria-hidden="true"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        <div className="inline-block w-full max-w-2xl bg-white border border-[#E2E8DF] rounded-3xl text-left shadow-2xl transform transition-all relative overflow-hidden my-4">
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-[#E2E8DF] flex items-center justify-between bg-[#F8FAF6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                  Pre-Order Pickup Reservation
                </h3>
                <p className="text-xs text-[#475569]">
                  Reserve fresh farm produce for weekend market stall collection
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {placedOrders && placedOrders.length > 0 ? (
              <CheckoutSuccessView
                placedOrders={placedOrders}
                copiedCode={copiedCode}
                onCopyCode={handleCopyCode}
                onClose={onClose}
                activeStall={activeStall}
                activeMarket={activeMarket}
              />
            ) : (
              <div className="space-y-6">
                {/* Stall Switcher & Summary Banner */}
                <CheckoutStallSelector
                  cartStalls={cartStalls}
                  selectedStallIndex={selectedStallIndex}
                  onSelectStallIndex={(idx) => {
                    setSelectedStallIndex(idx);
                    setSelectedMarketId('');
                    setSelectedDate('');
                    setSelectedSlot(null);
                  }}
                  activeStall={activeStall}
                  stallItems={stallItems}
                  stallSubtotal={stallSubtotal}
                  initialStall={initialStall}
                />

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                )}

                {/* STEP 1: Select Farmers Market */}
                <CheckoutMarketStep
                  availableMarkets={availableMarkets}
                  selectedMarketId={selectedMarketId}
                  onSelectMarket={(marketId) => {
                    setSelectedMarketId(marketId);
                    setSelectedSlot(null);
                  }}
                />

                {/* STEP 2: Select Pickup Date */}
                <CheckoutDateStep
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  cutoffHours={activeMarket?.cutoff_hours}
                />

                {/* STEP 3: Select Pickup Slot */}
                <CheckoutSlotStep
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  loadingSlots={loadingSlots}
                  slotsError={slotsError}
                  selectedDate={selectedDate}
                />

                {/* STEP 4: Customer Note */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
                    4. Note to Farmer (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={1000}
                    placeholder="E.g., Please select ripe avocados for tonight, or pack in reusable paper tote..."
                    className="w-full text-xs text-[#0F172A] bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl p-3 focus:outline-none focus:border-[#16A34A] focus:bg-white transition"
                  />
                </div>

                {/* STEP 5: Policy Assurance Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 text-xs text-[#15803D] flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-[#0F172A]">
                      Zero Online Payment • In-Person Settlement
                    </p>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      No online credit card fees or prepayment needed. Inspect your harvest at the booth and settle directly with {activeStall?.stall_name || 'the farmer'} using cash or card upon pickup.
                    </p>
                  </div>
                </div>

                {/* STEP 6: Summary & Submit Button */}
                <div className="pt-4 border-t border-[#E2E8DF] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto text-left">
                    <div className="text-[11px] text-[#475569]">Estimated Settlement at Stall:</div>
                    <div className="text-2xl font-black text-[#16A34A]">${stallSubtotal}</div>
                  </div>

                  <div className="w-full sm:w-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmPreOrder}
                      disabled={submitting || !selectedSlot || availableMarkets.length === 0}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Securing Reservation...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Pre-Order Reservation</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
