import React from 'react';
import { Link } from 'react-router-dom';
import {
  Ambulance,
  PhoneCall,
  Home,
  HeartPulse,
  ShieldAlert,
} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Medical Beacon Visual */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-30"></div>
          <div className="absolute inset-2 rounded-full bg-red-50 border-2 border-red-200"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-[#DC3545] text-white flex items-center justify-center shadow-lg shadow-red-500/30">
            <HeartPulse className="w-9 h-9 animate-pulse" />
          </div>
        </div>

        {/* 404 Headline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#DC3545] text-xs font-mono font-bold border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ERROR CODE: 404 • DISPATCH SIGNAL UNRESOLVED</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1F2A37]">
            Emergency Signal Lost
          </h1>

          <p className="text-xs sm:text-sm text-[#6B7785] max-w-lg mx-auto leading-relaxed">
            The medical dispatch route or page URL you requested cannot be located in the LifeLink metropolitan network. It may have been moved, renamed, or is currently out of service.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/ambulances"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#1F2A37] text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Ambulance className="w-4 h-4 text-[#0B6EFD]" />
            <span>Browse Ambulance Fleet</span>
          </Link>

          <a
            href="tel:03011111234"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-[#DC3545] text-xs font-bold transition shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Hotline: 030-1111-1234</span>
          </a>
        </div>

        {/* Helpful Emergency Directory Links */}
        <div className="pt-6 border-t border-[#E2E8F0] max-w-md mx-auto">
          <p className="text-xs font-bold text-[#1F2A37] mb-3 uppercase tracking-wider">
            Quick Navigation Directories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#0B6EFD] font-semibold">
            <Link to="/contact" className="hover:underline">
              Contact Dispatch Desk
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/feedback" className="hover:underline">
              Submit Patient Feedback
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/sitemap" className="hover:underline">
              Portal Sitemap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
