import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Calendar,
  ArrowRight,
  DollarSign,
  FileText,
  Sprout,
  XCircle,
  Star,
  Loader2,
} from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * CustomerOrderCard
 * Displays itemized reservation cards for shopper pre-orders with live actions.
 */
export default function CustomerOrderCard({
  order,
  onOpenSlip,
  onOpenReview,
  onCancelOrder,
  isCancelling = false,
}) {
  const items = Array.isArray(order.items) ? order.items : [];
  const marketName = order.market?.name || 'Farmers Market';
  const marketAddress = order.market?.address || '';
  const stallLocation = order.stall_location || 'Stall Booth';
  const farmerName = order.farmer?.stall_name || 'Grower Stall';
  const farmerContact = order.farmer?.contact_person || '';
  const farmerPhone = order.farmer?.contact_phone || '(312) 555-FARM';
  const pickupWindow = order.pickup_time_slot || `${order.pickup_start_time} - ${order.pickup_end_time}`;
  const totalAmount = Number(order.total_amount || 0).toFixed(2);
  const isCompleted = order.status === 'completed';
  const isCancelledOrDeclined = order.status === 'cancelled' || order.status === 'declined';
  const canCancel = Boolean(order.can_be_cancelled);

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 shadow-xs hover:border-emerald-300 transition space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-base font-black text-[#0F172A] font-mono">
              #{order.order_code}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-[11px] text-[#475569]">
            Reserved on {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onOpenSlip(order)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] hover:bg-slate-100 text-xs font-bold text-[#0F172A] transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Inspection Slip</span>
          </button>

          <Link
            to={`/user/orders/${encodeURIComponent(order.order_code)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-2xs"
          >
            <span>Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {canCancel && (
            <button
              type="button"
              onClick={() => onCancelOrder(order)}
              disabled={isCancelling}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Stall & Market */}
        <div className="space-y-1 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF]">
          <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
            <Store className="w-4 h-4" />
            <span>{stallLocation}</span>
          </div>
          <p className="font-bold text-[#0F172A]">{marketName}</p>
          {marketAddress && <p className="text-[11px] text-[#475569]">{marketAddress}</p>}
          <p className="text-[11px] text-[#475569] pt-1">
            Grower: <span className="font-semibold text-[#0F172A]">{farmerName}</span>
            {farmerContact && ` (${farmerContact})`}
          </p>
        </div>

        {/* Pickup Window */}
        <div className="space-y-1 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF]">
          <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
            <Calendar className="w-4 h-4" />
            <span>Pickup Window</span>
          </div>
          <p className="font-bold text-[#0F172A]">{order.pickup_date}</p>
          <p className="text-xs font-bold text-[#16A34A]">{pickupWindow}</p>
          <p className="text-[11px] text-[#475569] pt-1">
            Direct line: <span className="font-mono text-[#0F172A]">{farmerPhone}</span>
          </p>
        </div>

        {/* Settlement Amount */}
        <div className="space-y-1 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
              <DollarSign className="w-4 h-4" />
              <span>In-Person Settlement</span>
            </div>
            <p className="text-xl font-black text-[#0F172A] mt-1">${totalAmount} USD</p>
            <p className="text-[11px] text-amber-700 font-medium">
              Zero Online Fees • Pay at stall
            </p>
          </div>

          {isCompleted && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenReview ? onOpenReview(order) : null}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Rate & Review Harvest</span>
              </button>
            </div>
          )}

          {isCancelledOrDeclined && order.cancel_reason && (
            <p className="text-[11px] text-rose-600 font-medium pt-1">
              Reason: {order.cancel_reason}
            </p>
          )}
        </div>
      </div>

      {/* Reserved Items */}
      {items.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-2">
            Reserved Produce ({items.length} item{items.length === 1 ? '' : 's'})
          </p>
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
      )}
    </div>
  );
}
