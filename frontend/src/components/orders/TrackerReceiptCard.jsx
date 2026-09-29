import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Info, Printer, XCircle, Loader2, Star } from 'lucide-react';

/**
 * TrackerReceiptCard
 * Itemized pre-order receipt, cash settlement reminder, and actions.
 */
export default function TrackerReceiptCard({
  order,
  onPrintPass,
  onCancelOrder,
  cancelling = false,
}) {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];
  const pickupWindow = order.pickup_time_slot || `${order.pickup_start_time} - ${order.pickup_end_time}`;
  const totalAmount = Number(order.total_amount || 0).toFixed(2);
  const canCancel = Boolean(order.can_be_cancelled);
  const farmerName = order.farmer?.stall_name || 'the farmer';

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#16A34A]" />
          <span>Reserved Harvest Slip</span>
        </h3>
        <span className="text-xs font-mono text-[#475569]">
          {order.pickup_date} • {pickupWindow}
        </span>
      </div>

      {/* Items Table */}
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {items.map((it, idx) => {
          const itemPrice = Number(it.unit_price || 0).toFixed(2);
          const itemSubtotal = Number(
            it.subtotal || (Number(it.unit_price) * Number(it.quantity)) || 0
          ).toFixed(2);

          return (
            <div
              key={it.id || idx}
              className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-b-0"
            >
              <div className="truncate pr-2">
                <span className="font-bold text-[#0F172A] block truncate">
                  {it.product_name || it.name}
                </span>
                <span className="text-[11px] text-[#475569]">
                  {it.quantity} {it.unit} @ ${itemPrice} / {it.unit}
                </span>
              </div>
              <span className="font-bold text-[#0F172A] shrink-0">${itemSubtotal}</span>
            </div>
          );
        })}
      </div>

      {/* Calculations */}
      <div className="space-y-2 pt-2 text-xs border-t border-slate-100">
        <div className="flex justify-between text-[#475569]">
          <span>Produce Subtotal:</span>
          <span>${totalAmount}</span>
        </div>
        <div className="flex justify-between text-[#475569]">
          <span>Market Stall Reservation Surcharge:</span>
          <span className="font-bold text-[#16A34A]">$0.00 (Zero Fee)</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm font-black text-[#0F172A]">
          <span>Total for Pickup:</span>
          <span className="text-2xl text-[#16A34A]">${totalAmount}</span>
        </div>
      </div>

      {/* SRS Constraint Reminder */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600" />
          <span>Pay in Person at the Stall:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          Zero online payment fees. Please bring cash or card to settle directly with {farmerName} when inspecting your harvest crate at the stall.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={onPrintPass}
          className="w-full py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Mobile Pickup Pass</span>
        </button>

        {canCancel && (
          <button
            type="button"
            onClick={onCancelOrder}
            disabled={cancelling}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-[#DC2626] text-[#475569] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {cancelling ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>Cancel Pre-Order Reservation</span>
          </button>
        )}

        {order.status === 'completed' && (
          <Link
            to={`/feedback?requestId=${order.order_code}`}
            className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Leave Stall Feedback & Review</span>
          </Link>
        )}
      </div>
    </div>
  );
}
