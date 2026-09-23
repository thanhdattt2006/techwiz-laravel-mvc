import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import marketsData from '../../data/markets.json';
import {
  Store,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Navigation,
  Search,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [selectedMarketId, setSelectedMarketId] = useState(marketsData[0].id);

  const selectedMarket = useMemo(() => {
    return marketsData.find((m) => m.id === selectedMarketId) || marketsData[0];
  }, [selectedMarketId]);

  const filteredMarkets = useMemo(() => {
    return marketsData.filter((m) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        m.name.toLowerCase().includes(query) ||
        m.neighborhood.toLowerCase().includes(query) ||
        m.address.toLowerCase().includes(query) ||
        m.specialty.toLowerCase().includes(query);

      const matchesDay =
        selectedDay === 'ALL' ||
        m.operatingDays.toLowerCase().includes(selectedDay.toLowerCase());

      return matchesSearch && matchesDay;
    });
  }, [searchTerm, selectedDay]);

  const getGoogleMapsUrl = (market) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${market.name}, ${market.address}, ${market.city}, ${market.state} ${market.zip}`
    )}`;
  };

  const getMapEmbedUrl = (market) => {
    const deltaLat = 0.008;
    const deltaLng = 0.012;
    const minLon = market.longitude - deltaLng;
    const minLat = market.latitude - deltaLat;
    const maxLon = market.longitude + deltaLng;
    const maxLat = market.latitude + deltaLat;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${market.latitude}%2C${market.longitude}`;
  };

  return (
    <div className="space-y-12 pb-20">
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
        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by market name, neighborhood (Lincoln Park, Logan Square), or produce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
            />
          </div>

          {/* Day Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto shrink-0 pb-1 md:pb-0">
            {['ALL', 'Saturday', 'Sunday', 'Wednesday', 'Thursday'].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedDay === day
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                }`}
              >
                {day === 'ALL' ? 'All Market Days' : day}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map & Selected Market Focus */}
        <section className="bg-white border border-[#E2E8DF] rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#E2E8DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Interactive Market Locator (OpenStreetMap)
                </h2>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Currently focused on: <strong className="text-[#15803D]">{selectedMarket.name}</strong> ({selectedMarket.neighborhood})
              </p>
            </div>

            <a
              href={getGoogleMapsUrl(selectedMarket)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#16A34A] text-xs font-bold transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions to {selectedMarket.neighborhood}</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            {/* Map Frame */}
            <div className="lg:col-span-8 bg-slate-100 relative min-h-[320px] lg:min-h-[420px]">
              <iframe
                title={`Map location of ${selectedMarket.name}`}
                src={getMapEmbedUrl(selectedMarket)}
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
              />
            </div>

            {/* Selected Market Info Panel */}
            <div className="lg:col-span-4 p-6 sm:p-7 bg-[#F8FAF6] border-t lg:border-t-0 lg:border-l border-[#E2E8DF] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-[#15803D] border border-emerald-200 inline-block">
                  {selectedMarket.stallsCount} Certified Stalls
                </span>
                <h3 className="text-xl font-black text-[#0F172A] leading-tight">
                  {selectedMarket.name}
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {selectedMarket.description}
                </p>

                <div className="space-y-2.5 pt-2 text-xs text-[#475569] border-t border-slate-200/80">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{selectedMarket.address}, {selectedMarket.city}, {selectedMarket.state} {selectedMarket.zip}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span><strong>Schedule:</strong> {selectedMarket.operatingDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Hours:</strong> {selectedMarket.openingHours}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                <Link
                  to="/products"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Stalls & Pre-Order Produce</span>
                </Link>
                <a
                  href={getGoogleMapsUrl(selectedMarket)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => {
              const isSelected = market.id === selectedMarketId;
              return (
                <div
                  key={market.id}
                  className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[#16A34A] ring-2 ring-emerald-500/20'
                      : 'border-[#E2E8DF]'
                  }`}
                >
                  <div>
                    {/* Image Header */}
                    <div className="h-44 relative overflow-hidden bg-slate-100">
                      <img
                        src={market.image}
                        alt={market.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur text-[10px] font-bold">
                        {market.neighborhood}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-800/90 text-white backdrop-blur text-[11px] font-bold shadow-xs">
                        {market.stallsCount} Stalls
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#16A34A] transition">
                        {market.name}
                      </h3>

                      <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                        {market.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-[#475569] pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{market.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          <span>{market.operatingDays}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{market.openingHours}</span>
                        </div>
                      </div>

                      <div className="pt-2 bg-[#F8FAF6] p-3 rounded-xl border border-[#E2E8DF] text-[11px] text-[#475569]">
                        <span className="font-semibold text-[#0F172A] block mb-0.5">Specialties:</span>
                        <p className="line-clamp-2">{market.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMarketId(market.id);
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-emerald-100 text-[#15803D]'
                          : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                      }`}
                    >
                      {isSelected ? 'Viewing on Map' : 'Focus Map'}
                    </button>

                    <Link
                      to="/products"
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs"
                    >
                      <span>Pre-Order</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
