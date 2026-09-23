import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PhoneCall,
  Home,
  ShoppingBag,
  Store,
  HelpCircle,
} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Botanical Visual */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"></div>
          <div className="absolute inset-2 rounded-full bg-emerald-50 border-2 border-emerald-200"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Sprout className="w-9 h-9" />
          </div>
        </div>

        {/* 404 Headline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#15803D] text-xs font-mono font-bold border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ERROR CODE: 404 • HARVEST TRAIL UNRESOLVED</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0F172A]">
            Harvest Trail Not Found
          </h1>

          <p className="text-xs sm:text-sm text-[#475569] max-w-lg mx-auto leading-relaxed">
            The farmers market stall, seasonal harvest listing, or page URL you requested cannot be located in the MarketLink directory. It may have sold out for the season or been moved.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Market Home</span>
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8DF] text-[#0F172A] text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
            <span>Browse Fresh Produce</span>
          </Link>

          <Link
            to="/markets"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#15803D] text-xs font-bold transition shadow-xs"
          >
            <Store className="w-4 h-4 text-[#16A34A]" />
            <span>Local Markets Directory</span>
          </Link>
        </div>

        {/* Helpful Market Directory Links */}
        <div className="pt-6 border-t border-[#E2E8DF] max-w-md mx-auto">
          <p className="text-xs font-bold text-[#0F172A] mb-3 uppercase tracking-wider">
            Quick Navigation Shortcuts
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#16A34A] font-semibold">
            <Link to="/contact" className="hover:underline">
              Contact Market Desk
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/feedback" className="hover:underline">
              Customer Reviews
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/sitemap" className="hover:underline">
              Platform Sitemap
            </Link>
            <span className="text-slate-300">•</span>
            <a href="tel:3125553276" className="flex items-center gap-1 hover:underline text-amber-700">
              <PhoneCall className="w-3 h-3 text-amber-500" />
              <span>(312) 555-FARM</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

