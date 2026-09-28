import React from 'react';
import { Store, MapPin, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * FarmerMarketCard (Phase 4.14)
 * Renders individual market stall registration with pickup schedule, slots, and actions.
 */
export default function FarmerMarketCard({ farmerMarket, onEdit, onUnlink }) {
  const market = farmerMarket.market || {};
  const daysList = Array.isArray(farmerMarket.pickup_days)
    ? farmerMarket.pickup_days.map((d) => DAY_NAMES[Number(d)]).filter(Boolean)
    : [];

  const timeRange = `${farmerMarket.pickup_start_time?.slice(0, 5) || '07:00'} – ${
    farmerMarket.pickup_end_time?.slice(0, 5) || '13:00'
  }`;

  return (
    <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-5 space-y-4 hover:border-emerald-300 transition shadow-2xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#0F172A]">{market.name || 'Farmers Market'}</h4>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  farmerMarket.is_active
                    ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {farmerMarket.is_active ? 'Active' : 'Paused'}
              </span>
            </div>
            <p className="text-[11px] text-[#475569] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{market.address || market.city || 'Chicago, IL'}</span>
            </p>
          </div>
        </div>

        {farmerMarket.stall_location && (
          <span className="text-xs font-mono font-bold text-[#16A34A] bg-white px-2.5 py-1 rounded-lg border border-[#E2E8DF] shadow-2xs shrink-0">
            {farmerMarket.stall_location}
          </span>
        )}
      </div>

      {/* Schedule & Operational Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-[#E2E8DF]">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#16A34A]" />
            Operating Days
          </span>
          <p className="font-bold text-[#0F172A]">
            {daysList.length > 0 ? daysList.join(', ') : 'Saturdays'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#16A34A]" />
            Pickup Window
          </span>
          <p className="font-bold text-[#0F172A] font-mono">{timeRange}</p>
        </div>

        <div className="space-y-1 pt-1.5 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pickup Slots</span>
          <p className="font-semibold text-[#0F172A]">
            {farmerMarket.slot_minutes || 30} minutes per slot
          </p>
        </div>

        <div className="space-y-1 pt-1.5 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400">Order Cutoff</span>
          <p className="font-semibold text-[#0F172A]">
            {farmerMarket.cutoff_hours || 12}h prior to market
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#E2E8DF]/60">
        <button
          type="button"
          onClick={() => onEdit(farmerMarket)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-white text-xs font-bold text-[#475569] hover:text-[#16A34A] hover:border-emerald-300 transition cursor-pointer shadow-2xs"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Config</span>
        </button>

        <button
          type="button"
          onClick={() => onUnlink(farmerMarket)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Withdraw</span>
        </button>
      </div>
    </div>
  );
}
