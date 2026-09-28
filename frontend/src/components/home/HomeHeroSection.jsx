import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingBag, Store, PhoneCall } from 'lucide-react';

/**
 * HomeHeroSection Component
 * Eye-catching hero banner for MarketLink with CTAs and live metric summary.
 */
export default function HomeHeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#15803D] via-[#16A34A] to-emerald-700 text-white py-16 sm:py-20 px-4 sm:px-8 shadow-lg">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold border border-white/25">
            <Sprout className="w-3.5 h-3.5 text-amber-300" />
            <span>eGreen Basket • Farm Fresh Just a Click Away</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Connect Directly with <br />
            <span className="text-amber-300">Local Farmers Markets</span>
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            Explore freshly harvested organic vegetables, orchard fruits, farm dairy, artisan bread, and raw honey. Pre-order ahead to guarantee your favorite items at your neighborhood market stall.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#15803D] hover:bg-emerald-50 font-black text-sm shadow-lg shadow-black/10 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
              <span>Browse Fresh Produce</span>
            </Link>
            <Link
              to="/markets"
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-400/40 text-white font-bold text-sm transition"
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span>Explore Local Markets</span>
            </Link>
            <a
              href="tel:3125553276"
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span>(312) 555-FARM</span>
            </a>
          </div>
        </div>

        {/* Hero Statistics Metric Panel */}
        <div className="lg:col-span-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-xs space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <span className="font-semibold text-emerald-100">Local Farmers Markets:</span>
            <span className="font-black text-amber-300 text-sm">6 Active Markets</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <span className="font-semibold text-emerald-100">Family Farms & Stalls:</span>
            <span className="font-bold text-white text-sm">48+ Independent Growers</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <span className="font-semibold text-emerald-100">Direct Stall Pickup:</span>
            <span className="font-bold text-emerald-200 text-sm">100% In-Person & Cash/Card</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-100">Delivery Markup Fee:</span>
            <span className="font-black text-amber-300 text-sm">$0.00 (Zero Middlemen)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
