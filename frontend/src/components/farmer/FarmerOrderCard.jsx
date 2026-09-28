import React from 'react';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Sprout,
  DollarSign,
  CheckCircle2,
  Package,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * FarmerOrderCard (Phase 4.12)
 * Renders individual incoming customer pre-orders with live State Machine controls:
 * placed -> accepted -> ready_for_pickup -> completed (cash settlement).
 */
export default function FarmerOrderCard({
  order,
  onAccept,
  onMarkReady,
  onComplete,
  onOpenDeclineModal,
  actionLoading = false,
}) {
  const items = Array.isArray(order.items) ? order.items : [];
  const status = order.status;
  const totalAmount = Number(order.total_amount || 0).toFixed(2);
  const customer = order.customer || {};
  const pickupWindow = order.pickup_time_slot || `${order.pickup_start_time} - ${order.pickup_end_time}`;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 shadow-xs hover:border-emerald-300 transition space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-base font-black text-[#0F172A] font-mono">
              #{order.order_code}
            </span>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-[#475569] flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
              <User className="w-3.5 h-3.5 text-[#16A34A]" />
              {customer.fullname || 'Customer'}
            </span>
            {customer.phone && (
              <a
                href={`tel:${customer.phone.replace(/[^0-9+]/g, '')}`}
                className="font-mono text-[11px] text-[#16A34A] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{customer.phone}</span>
              </a>
            )}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-[#475569] block">Cash at Stall</span>
          <span className="text-xl font-black text-[#16A34A]">${totalAmount} USD</span>
        </div>
      </div>

      {/* Pickup Details & Customer Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="font-bold text-[#475569] uppercase text-[10px] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Pickup Schedule</span>
          </span>
          <p className="font-bold text-[#0F172A]">{order.pickup_date}</p>
          <p className="text-[11px] text-[#16A34A] font-semibold">{pickupWindow}</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="font-bold text-[#475569] uppercase text-[10px] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Stall Booth Location</span>
          </span>
          <p className="font-bold text-[#0F172A]">{order.stall_location || 'Booth'}</p>
          <p className="text-[11px] text-[#475569] truncate">{order.market?.name || 'Farmers Market'}</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="font-bold text-[#475569] uppercase text-[10px]">Customer Notes</span>
          <p className="text-[11px] text-[#0F172A] italic line-clamp-2">
            {order.notes ? `"${order.notes}"` : 'No special packing instructions.'}
          </p>
        </div>
      </div>

      {/* Produce Items to Pack & Inspect */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
          Produce Items to Pack & Inspect ({items.length})
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((it, idx) => (
            <div
              key={it.id || idx}
              className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8DF] bg-white text-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <Sprout className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span className="font-bold text-[#0F172A] truncate">
                  {it.product_name || it.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-[#0F172A]">
                  {it.quantity} {it.unit}
                </span>
                <span className="text-[#475569] ml-2">
                  (${Number(it.subtotal || (Number(it.unit_price) * Number(it.quantity)) || 0).toFixed(2)})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation / Decline Banner */}
      {(status === 'cancelled' || status === 'declined') && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-0.5">
          <p className="font-bold text-rose-900 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>{status === 'declined' ? 'Declined by Stall' : 'Cancelled by Customer'}</span>
          </p>
          {order.cancel_reason && (
            <p className="text-[11px] text-rose-700">Reason: "{order.cancel_reason}"</p>
          )}
        </div>
      )}

      {/* State Machine Transition Action Controls */}
      {status !== 'completed' && status !== 'cancelled' && status !== 'declined' && (
        <div className="pt-3 border-t border-[#E2E8DF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Step 1: Placed -> Accept */}
            {status === 'placed' && (
              <button
                type="button"
                onClick={() => onAccept(order.id)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                <span>Accept Pre-Order</span>
              </button>
            )}

            {/* Step 2: Accepted -> Ready for Pickup */}
            {status === 'accepted' && (
              <button
                type="button"
                onClick={() => onMarkReady(order.id)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Mark Ready at Stall</span>
              </button>
            )}

            {/* Step 3: Ready -> Complete Pickup */}
            {status === 'ready_for_pickup' && (
              <button
                type="button"
                onClick={() => onComplete(order)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                <span>Complete Pickup & Settle Cash (${totalAmount})</span>
              </button>
            )}
          </div>

          {/* Decline button (allowed when placed or accepted) */}
          {(status === 'placed' || status === 'accepted') && (
            <button
              type="button"
              onClick={() => onOpenDeclineModal(order)}
              disabled={actionLoading}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition cursor-pointer disabled:opacity-50"
            >
              Decline Reservation
            </button>
          )}
        </div>
      )}

      {status === 'completed' && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#16A34A] font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Produce Inspected & In-Person Cash Settle Cleared</span>
        </div>
      )}
    </div>
  );
}
