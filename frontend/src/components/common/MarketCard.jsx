import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, CheckCircle2, Heart } from 'lucide-react';

/**
 * MarketCard Component
 * Reusable card displaying local Farmers Market details, schedules, and stall counts.
 *
 * @param {object} market - Market details
 * @param {boolean} isSelected - Whether market is actively selected on map
 * @param {function} onSelect - Optional click handler to focus map
 * @param {boolean} isFavorited - Whether current user has favorited this market
 * @param {function} onToggleFavorite - Optional callback to toggle favorite
 */
export default function MarketCard({
  market,
  isSelected = false,
  onSelect = null,
  isFavorited = false,
  onToggleFavorite = null,
  className = '',
}) {
  if (!market) return null;

  const stallsCount = market.active_stalls_count ?? market.stallsCount ?? (market.farmers?.length || 0);
  const operatingDays = market.schedules && market.schedules.length > 0
    ? market.schedules.map((s) => s.day_name).join(', ')
    : (market.operatingDays || 'Weekend Meetings');
  const openingHours = market.schedules && market.schedules.length > 0
    ? `${market.schedules[0].open_time} - ${market.schedules[0].close_time}`
    : (market.openingHours || '08:00 AM - 01:00 PM');
  const locationLabel = market.neighborhood || market.city || (market.address ? market.address.split(',')[0] : 'Chicago, IL');

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
        <div className="h-44 relative overflow-hidden bg-slate-100">
          <img
            src={market.image || '/default-stall-cover.png'}
            alt={market.name}
            onError={(e) => { e.currentTarget.src = '/default-stall-cover.png'; }}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-800/90 text-white backdrop-blur shadow-xs">
              {stallsCount} Certified Stalls
            </span>
          </div>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(market.id, e);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition shadow-xs cursor-pointer ${
                isFavorited
                  ? 'bg-rose-50/95 text-rose-600 border border-rose-200'
                  : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-500'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl text-white">
            <h3 className="text-base font-bold leading-snug drop-shadow-xs">
              {market.name}
            </h3>
            <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </p>
          </div>
        </div>

        {/* Market Details */}
        <div className="p-6 space-y-3.5">
          <div className="space-y-2 text-xs text-[#475569]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>
                <strong>Schedule:</strong> {operatingDays}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Hours:</strong> {openingHours}
              </span>
            </div>
            {market.address && (
              <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  {market.address}{market.city ? `, ${market.city}` : ''}
                </span>
              </div>
            )}
            {market.description && (
              <p className="text-[11px] leading-relaxed text-[#475569] pt-1 line-clamp-2">
                {market.description}
              </p>
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
          to={`/products?market_id=${market.id}`}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] text-xs font-bold transition shadow-2xs"
          title={`Browse produce and stalls at ${market.name}`}
        >
          <span>Browse Stalls & Produce</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
