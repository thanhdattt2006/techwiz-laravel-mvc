import React from 'react';
import { Phone, Mail, MapPin, Clock, Sprout, Store } from 'lucide-react';

/**
 * ContactInfoSidebar
 * Left-column card displaying MarketLink HQ contact info, phone, email, address, and hours.
 */
export default function ContactInfoSidebar() {
  return (
    <div className="lg:col-span-5 bg-linear-to-br from-[#16A34A] to-[#15803D] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-8">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 mb-3">
            <Sprout className="w-3.5 h-3.5 text-emerald-200" />
            <span>Central Green Loop Headquarters</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Market Coordination Hub</h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Our central market team coordinates vendor stall allocations, inspects organic compliance, and assists shoppers across all 6 Chicago community markets.
          </p>
        </div>

        <div className="space-y-5 text-xs text-emerald-100">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
              <Phone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="block text-emerald-200 text-[11px] font-semibold">Farmer & Shopper Helpline</span>
              <a href="tel:3125553276" className="text-sm font-bold text-white hover:underline">(312) 555-FARM / (312) 555-3276</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
              <Mail className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="block text-emerald-200 text-[11px] font-semibold">Support & Vendor Inquiries</span>
              <a href="mailto:support@marketlink.org" className="text-sm font-bold text-white hover:underline block">support@marketlink.org</a>
              <a href="mailto:vendors@marketlink.org" className="text-xs text-emerald-200 hover:underline">vendors@marketlink.org</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
              <MapPin className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="block text-emerald-200 text-[11px] font-semibold">MarketLink Operations HQ</span>
              <span className="text-sm font-bold text-white block">450 N Michigan Ave, Chicago, IL 60611</span>
              <span className="text-[11px] text-emerald-200">Green Loop Central Administrative Suite</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="block text-emerald-200 text-[11px] font-semibold">Office & Market Hours</span>
              <span className="text-xs font-bold text-white block">Mon – Fri: 08:00 AM – 05:00 PM CST</span>
              <span className="text-xs text-emerald-200 block">Sat Market Coordination: 06:30 AM – 02:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/20 text-[11px] text-emerald-100 flex items-center gap-2">
        <Store className="w-4 h-4 text-emerald-200 shrink-0" />
        <span>Dedicated to zero food miles & community family farms</span>
      </div>
    </div>
  );
}
