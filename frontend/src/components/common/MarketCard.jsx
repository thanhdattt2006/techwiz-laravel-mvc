import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * MarketCard Component
 * Reusable card displaying local Farmers Market details, schedules, and stall counts.
 *
 * @param {object} market - Market details
 * @param {boolean} isSelected - Whether market is actively selected on map
 * @param {function} onSelect - Optional click handler to focus map
 */
export default function MarketCard({
  market,
  isSelected = false,
  onSelect = null,
  className = '',
}) {
  if (!market) return null;

  return (
    <div
      onClick={() => onSelect && onSelect(market)}
      className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group ${
        isSelected
          ? 'border-[#16A34A] ring-2 ring-emerald-500/20'
          : 'border-[#E2E8DF]'
      } ${onSelect ? 'cursor-pointer' : ''} ${className}`}
    >
      <div>
        {/* Header / Image banner */}
        {market.image ? (
          <div className="h-44 relative overflow-hidden bg-slate-100">
            <img
              src={market.image}
              alt={market.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-800/90 text-white backdrop-blur shadow-xs">
                {market.stallsCount} Certified Stalls
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl text-white">
              <h3 className="text-base font-bold leading-snug drop-shadow-xs">
                {market.name}
              </h3>
              <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">{market.neighborhood || market.city}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gradient-to-br from-[#16A34A] to-emerald-800 text-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur border border-white/20 inline-block">
              {market.stallsCount} Artisan Stalls
            </span>
            <h3 className="text-lg font-black leading-snug group-hover:text-amber-200 transition">
              {market.name}
            </h3>
            <p className="text-xs text-emerald-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{market.neighborhood || market.city}</span>
            </p>
          </div>
        )}

        {/* Market Details */}
        <div className="p-6 space-y-3.5">
          <div className="space-y-2 text-xs text-[#475569]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>
                <strong>Schedule:</strong> {market.operatingDays}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Hours:</strong> {market.openingHours}
              </span>
            </div>
            {market.address && (
              <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  {market.address}, {market.city}
                </span>
              </div>
            )}
            {market.specialty && (
              <p className="text-[11px] leading-relaxed text-[#475569] pt-1">
                {market.specialty}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-6 pt-0 border-t border-[#E2E8DF] flex items-center justify-between mt-auto">
        <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
          Verified
        </span>

        <Link
          to={`/products?market=${encodeURIComponent(market.name)}`}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] text-xs font-bold transition"
        >
          <span>Browse Stalls</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
