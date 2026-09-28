import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Store,
  MapPin,
  Clock,
  Info,
  Copy,
  Check,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

/**
 * CheckoutSuccessView
 * Displays confirmed order code cards, stall pickup location, and quick actions.
 */
export default function CheckoutSuccessView({
  placedOrders,
  copiedCode,
  onCopyCode,
  onClose,
  activeStall,
  activeMarket,
}) {
  const navigate = useNavigate();

  return (
    <div className="text-center py-4 space-y-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Harvest Reservation Confirmed
        </span>
        <h4 className="text-xl sm:text-2xl font-black text-[#0F172A] pt-2">
          Your Pre-Order is Secured!
        </h4>
        <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto">
          The farmer has been notified and will package your fresh harvest for stall pickup.
        </p>
      </div>

      {/* Generated Order Cards */}
      <div className="space-y-3 max-w-md mx-auto text-left">
        {placedOrders.map((order) => (
          <div
            key={order.id || order.order_code}
            className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#475569] uppercase font-bold tracking-wider">
                  Order Code
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-sm sm:text-base font-black text-[#16A34A]">
                    {order.order_code}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopyCode(order.order_code)}
                    className="p-1 text-slate-400 hover:text-[#16A34A] transition cursor-pointer"
                    title="Copy Order Code"
                  >
                    {copiedCode === order.order_code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <span className="text-sm font-black text-[#0F172A] bg-white px-3 py-1 rounded-xl border border-slate-200">
                ${Number(order.total_amount).toFixed(2)}
              </span>
            </div>

            <div className="text-xs text-[#475569] space-y-1 pt-2 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span className="font-bold text-[#0F172A]">
                  {order.farmer?.stall_name || activeStall?.stall_name}
                </span>
                {order.stall_location && (
                  <span className="text-slate-400">({order.stall_location})</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{order.market?.name || activeMarket?.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>
                  {order.pickup_date} • {order.pickup_time_slot || `${order.pickup_start_time} - ${order.pickup_end_time}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SRS Cash Settlement Reminder Banner */}
      <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Payment at Stall</strong>: Present your order code at the stall and settle payment in person using cash or card. No upfront fee was charged online.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            onClose();
            const firstCode = placedOrders[0]?.order_code;
            if (firstCode) {
              navigate(`/orders/track/${encodeURIComponent(firstCode)}`);
            }
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Track Pre-Order Status</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/customer/orders');
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#E2E8DF] hover:bg-slate-50 text-[#0F172A] text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View All My Orders</span>
        </button>
      </div>
    </div>
  );
}
