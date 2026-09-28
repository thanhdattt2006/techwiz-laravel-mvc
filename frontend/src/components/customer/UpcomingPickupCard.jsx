import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Sprout, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * UpcomingPickupCard (Phase 4.11)
 * Displays the customer's next active stall reservation pickup pass.
 */
export default function UpcomingPickupCard({ upcomingOrder, loading }) {
  const items = Array.isArray(upcomingOrder?.items) ? upcomingOrder.items : [];
  const pickupWindow = upcomingOrder?.pickup_time_slot || `${upcomingOrder?.pickup_start_time} - ${upcomingOrder?.pickup_end_time}`;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Next Scheduled Pickup Pass</span>
          </div>
          {upcomingOrder ? (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {upcomingOrder.market?.name || 'Farmers Market'} • {upcomingOrder.stall_location || 'Stall Booth'}
                </h2>
                <StatusBadge status={upcomingOrder.status} />
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Grower: {upcomingOrder.farmer?.stall_name || 'Independent Farm'}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">No Active Pickup Right Now</h2>
              <p className="text-xs text-[#475569] mt-0.5">
                You do not have any pending stall reservations for the upcoming market.
              </p>
            </div>
          )}
        </div>

        {upcomingOrder && (
          <div className="flex items-center gap-2">
            <Link
              to={`/orders/track/${encodeURIComponent(upcomingOrder.order_code)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition"
            >
              <span>Live Pickup Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-8 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#16A34A] mx-auto" />
          <p className="text-xs text-[#475569]">Loading your pickup passes...</p>
        </div>
      ) : upcomingOrder ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF]">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#475569] uppercase">Pickup Date & Window</p>
                <p className="text-xs font-bold text-[#0F172A]">{upcomingOrder.pickup_date}</p>
                <p className="text-[11px] text-[#16A34A] font-semibold">{pickupWindow}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#475569] uppercase">Stall Coordinates</p>
                <p className="text-xs font-bold text-[#0F172A]">{upcomingOrder.stall_location || 'Booth #01'}</p>
                <p className="text-[11px] text-[#475569]">{upcomingOrder.market?.address || 'Market Grounds'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#475569] uppercase">Inspection Cash Slip</p>
                <p className="text-xs font-bold text-[#0F172A]">
                  ${Number(upcomingOrder.total_amount || 0).toFixed(2)} USD
                </p>
                <p className="text-[11px] text-amber-700 font-medium">Pay in person at stall</p>
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                Reserved Produce in Tote ({upcomingOrder.order_code})
              </h3>
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
                    <span className="font-bold text-[#0F172A]">
                      {it.quantity} {it.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-3">
          <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs text-[#475569]">
            Explore this week's fresh harvest from regional family farms to reserve your next stall pickup.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs"
          >
            <span>Explore Produce Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
