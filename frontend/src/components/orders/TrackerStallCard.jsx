import React from 'react';
import { Store, MapPin, Sprout, Navigation, PhoneCall } from 'lucide-react';

/**
 * TrackerStallCard
 * Displays farmers market location, stall booth number, interactive OpenStreetMap, and contact info.
 */
export default function TrackerStallCard({ order }) {
  if (!order) return null;

  const market = order.market || {};
  const farmer = order.farmer || {};
  const stallLocation = order.stall_location || 'Stall Booth';

  const lat = Number(market.latitude || 41.8781);
  const lng = Number(market.longitude || -87.6298);

  const mapUrl = market.map_embed_url || `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${market.name || 'Farmers Market'} ${market.address || 'Chicago, IL'}`)}`;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-[#16A34A]" />
          <h3 className="text-base font-bold text-[#0F172A]">
            Stall Pickup Location & Directions
          </h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-[#15803D]">
          {stallLocation}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#475569]">
        <div className="space-y-1">
          <span className="text-[11px] text-[#475569] block">Farmers Market:</span>
          <strong className="text-sm text-[#0F172A] block">{market.name || 'Local Farmers Market'}</strong>
          <p className="text-[11px] text-[#475569]">{market.address || 'Chicago, IL'}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-[#475569] block">Family Farm & Grower:</span>
          <strong className="text-sm text-[#15803D] block flex items-center gap-1">
            <Sprout className="w-4 h-4 text-[#16A34A]" /> {farmer.stall_name || 'Participating Farm'}
          </strong>
          {farmer.contact_person && (
            <p className="text-[11px] text-[#475569]">Grower: {farmer.contact_person}</p>
          )}
        </div>
      </div>

      {/* Navigation Directions */}
      <div className="p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1 text-xs">
        <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-amber-500" />
          <span>How to Find the Stall on Market Day:</span>
        </span>
        <p className="text-[#475569] leading-relaxed">
          Proceed to <strong>{stallLocation}</strong> at {market.name}. Look for the booth sign displaying <em>"{farmer.stall_name || 'Farm Fresh Produce'}"</em>. Present your order code to the stall master.
        </p>
      </div>

      {/* Embedded Map */}
      <div className="rounded-2xl overflow-hidden border border-[#E2E8DF] h-52 relative bg-slate-100">
        <iframe
          title={`${market.name || 'Market'} Location Map`}
          src={mapUrl}
          className="w-full h-full border-0 absolute inset-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:underline"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Open in Google Maps Navigation</span>
        </a>

        {farmer.contact_phone && (
          <a
            href={`tel:${farmer.contact_phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#0F172A]"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            <span>Call Stall: {farmer.contact_phone}</span>
          </a>
        )}
      </div>
    </div>
  );
}
