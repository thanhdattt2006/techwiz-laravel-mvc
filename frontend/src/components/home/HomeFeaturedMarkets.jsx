import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { MarketCard } from '../common';

/**
 * HomeFeaturedMarkets Component
 * Displays featured local markets with loading skeletons and view-all link.
 */
export default function HomeFeaturedMarkets({ markets = [], loading = false }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" /> Neighborhood Meeting Points
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Featured Chicago Farmers Markets
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Visit local markets on scheduled weekend days to collect your fresh pre-orders directly from growers.
          </p>
        </div>
        <Link
          to="/markets"
          className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#15803D] hover:underline shrink-0"
        >
          <span>View All Markets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-[#E2E8DF] rounded-3xl h-72 p-6 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-6 w-24 bg-slate-100 rounded-full" />
                <div className="h-6 w-48 bg-slate-200 rounded-lg" />
                <div className="h-4 w-32 bg-slate-100 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-lg" />
                <div className="h-4 w-2/3 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </section>
  );
}
