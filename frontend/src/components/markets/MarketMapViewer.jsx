import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  ExternalLink,
  ShoppingBag,
  Heart,
  Tractor,
  CheckCircle2,
} from 'lucide-react';

/**
 * MarketMapViewer Component
 * Interactive OpenStreetMap locator and detailed stall roster panel for a focused market.
 */
export default function MarketMapViewer({
  market,
  loadingDetail = false,
  isFavorited = false,
  onToggleFavorite,
}) {
  if (!market) return null;

  const getGoogleMapsUrl = (m) => {
    if (!m) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${m.name}, ${m.address || 'Chicago, IL'}`
    )}`;
  };

  const getMapEmbedUrl = (m) => {
    if (!m || !m.latitude || !m.longitude) {
      return 'https://www.openstreetmap.org/export/embed.html?bbox=-87.75%2C41.83%2C-87.55%2C41.97&layer=mapnik';
    }
    const deltaLat = 0.008;
    const deltaLng = 0.012;
    const lat = Number(m.latitude);
    const lng = Number(m.longitude);
    const minLon = lng - deltaLng;
    const minLat = lat - deltaLat;
    const maxLon = lng + deltaLng;
    const maxLat = lat + deltaLat;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  const stallCount =
    market.active_stalls_count ||
    market.stallsCount ||
    market.farmers?.length ||
    0;

  const operatingDays =
    market.schedules && market.schedules.length > 0
      ? market.schedules.map((s) => s.day_name).join(', ')
      : market.operatingDays || 'Weekends';

  const operatingHours =
    market.schedules && market.schedules.length > 0
      ? `${market.schedules[0].open_time} - ${market.schedules[0].close_time}`
      : market.openingHours || '08:00 AM - 01:00 PM';

  return (
    <section className="bg-white border border-[#E2E8DF] rounded-3xl overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="p-6 border-b border-[#E2E8DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Interactive Market Locator (OpenStreetMap)
            </h2>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Currently focused on: <strong className="text-[#15803D]">{market.name}</strong> (
            {market.neighborhood || market.address || 'Chicago'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => onToggleFavorite(market.id, e)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isFavorited
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-[#E2E8DF] text-[#475569] hover:text-rose-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorited ? 'Bookmarked' : 'Bookmark Market'}</span>
            </button>
          )}

          <a
            href={getGoogleMapsUrl(market)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#16A34A] text-xs font-bold transition"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* Map Frame */}
        <div className="lg:col-span-7 bg-slate-100 relative min-h-[320px] lg:min-h-[440px]">
          <iframe
            title={`Map location of ${market.name}`}
            src={getMapEmbedUrl(market)}
            className="w-full h-full border-0 absolute inset-0"
            loading="lazy"
          />
        </div>

        {/* Selected Market Info Panel */}
        <div className="lg:col-span-5 p-6 sm:p-7 bg-[#F8FAF6] border-t lg:border-t-0 lg:border-l border-[#E2E8DF] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-[#15803D] border border-emerald-200 inline-block">
                {stallCount} Certified Stalls
              </span>
              <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Official Market
              </span>
            </div>

            <h3 className="text-xl font-black text-[#0F172A] leading-tight">
              {market.name}
            </h3>

            <p className="text-xs text-[#475569] leading-relaxed">
              {market.description ||
                'Join local farmers every weekend to purchase certified organic fruits, vegetables, dairy, artisan bread, and pantry goods.'}
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-[#475569] border-t border-slate-200/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{market.address || 'Chicago, IL'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>
                  <strong>Schedule:</strong> {operatingDays}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Hours:</strong> {operatingHours}
                </span>
              </div>
            </div>

            {/* Registered Stalls Roster */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-[11px] font-bold text-[#0F172A] mb-2 flex items-center gap-1.5">
                <Tractor className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Participating Stalls ({market.farmers?.length || 0})</span>
              </div>

              {loadingDetail ? (
                <div className="text-xs text-[#475569] py-2 italic">
                  Loading participating farm stalls...
                </div>
              ) : market.farmers && market.farmers.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {market.farmers.map((farmer) => (
                    <div
                      key={farmer.id}
                      className="p-2 rounded-xl bg-white border border-[#E2E8DF] flex items-center justify-between text-xs"
                    >
                      <div className="truncate mr-2">
                        <span className="font-bold text-[#0F172A] block truncate">
                          {farmer.stall_name}
                        </span>
                        <span className="text-[10px] text-[#475569]">
                          {farmer.stall_location || farmer.contact_person || 'Active Stall'}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        Open for Pre-order
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-[#475569] italic">
                  Stall assignments for this season will appear here.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-200">
            <Link
              to={`/products?market_id=${market.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Stalls & Pre-Order Produce</span>
            </Link>

            <a
              href={getGoogleMapsUrl(market)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E2E8DF] hover:bg-slate-50 text-[#0F172A] text-xs font-bold transition"
            >
              <Navigation className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Open in Navigation App</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
