import React from 'react';
import { Store } from 'lucide-react';
import { MarketCard } from '../../components/common';
import { MarketMapViewer, MarketFilterBar } from '../../components/markets';
import { useMarkets } from '../../hooks/useMarkets';

/**
 * MarketsPage Component
 * Public directory and interactive locator for certified farmers markets across Chicago.
 * Refactored to follow SOLID principles and clean separation of concerns.
 */
export default function MarketsPage() {
  const {
    filteredMarkets,
    activeMarket,
    selectedMarketId,
    setSelectedMarketId,
    loading,
    loadingDetail,
    searchTerm,
    setSearchTerm,
    selectedDay,
    setSelectedDay,
    favoritedIds,
    toggleFavorite,
  } = useMarkets();

  return (
    <div className="space-y-12 pb-20 font-sans antialiased text-[#0F172A]">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#15803D] via-[#16A34A] to-emerald-700 text-white py-12 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold border border-white/20">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>Community Supported Agriculture • Weekly Neighborhood Gathering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Chicago Farmers Markets Directory & Interactive Map
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed">
            Find certified farmers markets across Chicago neighborhoods. Explore operating days, morning pickup windows, grower stall rosters, and get direct GPS navigation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search & Day Filter Toolbar */}
        <MarketFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
        />

        {/* Interactive Map & Focused Market Viewer */}
        {activeMarket && (
          <MarketMapViewer
            market={activeMarket}
            loadingDetail={loadingDetail}
            isFavorited={favoritedIds.includes(activeMarket.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* All Markets Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                All Local Farmers Markets ({filteredMarkets.length})
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                Select any market below to view on map or explore stalls.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : filteredMarkets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  isSelected={market.id === selectedMarketId}
                  isFavorited={favoritedIds.includes(market.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={(m) => {
                    setSelectedMarketId(m.id);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white border border-[#E2E8DF] rounded-3xl">
              <Store className="w-12 h-12 text-[#475569] mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-[#0F172A]">No farmers markets found</h3>
              <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
                No markets match your current search criteria or selected meeting day. Try clearing your filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
