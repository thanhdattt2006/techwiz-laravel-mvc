import React from 'react';
import { Compass } from 'lucide-react';

/**
 * ContactMapSection
 * Embedded Google Maps iframe showing MarketLink HQ location with GPS coordinates.
 */
export default function ContactMapSection() {
  return (
    <section className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              HQ Office: Open & Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            Chicago Green Loop Market Operations Office & Coordination Hub
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Located in downtown Chicago along the Green Loop corridor, coordinating farmer supply logistics across 6 community farmers markets.
          </p>
        </div>

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=450+N+Michigan+Ave,+Chicago,+IL"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] hover:bg-emerald-100 text-xs font-bold transition shadow-2xs shrink-0"
        >
          <Compass className="w-4 h-4 text-[#16A34A]" />
          <span>Get HQ Directions</span>
        </a>
      </div>

      {/* Embedded Interactive Map */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E2E8DF] shadow-inner bg-slate-100">
        <iframe
          title="MarketLink Central Office Location Map"
          src="https://maps.google.com/maps?q=450%20N%20Michigan%20Ave,%20Chicago,%20IL&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>

      {/* Map Coordinates & Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
        <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="text-[#475569] font-bold block text-[11px] uppercase">Central Address</span>
          <span className="font-bold text-[#0F172A]">450 N Michigan Ave, Chicago, IL 60611</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="text-[#475569] font-bold block text-[11px] uppercase">GPS Coordinates</span>
          <span className="font-mono font-bold text-[#16A34A]">41°53'25.4"N 87°37'26.4"W</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="text-[#475569] font-bold block text-[11px] uppercase">Metropolitan Market Network</span>
          <span className="font-bold text-[#16A34A]">6 Active Farmers Markets • 180+ Stalls</span>
        </div>
      </div>
    </section>
  );
}
