import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Ambulance,
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowRight,
  PhoneCall,
  Activity,
  HeartPulse,
} from 'lucide-react';

import ambulancesData from '../../data/ambulances.json';

const MOCK_AMBULANCES = ambulancesData;

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortByPrice, setSortByPrice] = useState('default');

  const filteredAmbulances = useMemo(() => {
    return MOCK_AMBULANCES.filter((amb) => {
      const matchSearch =
        searchTerm === '' ||
        amb.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        amb.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        amb.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType =
        selectedType === 'ALL' || amb.type.toUpperCase() === selectedType.toUpperCase();

      return matchSearch && matchType;
    }).sort((a, b) => {
      if (sortByPrice === 'asc') return a.price - b.price;
      if (sortByPrice === 'desc') return b.price - a.price;
      return 0;
    });
  }, [searchTerm, selectedType, sortByPrice]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-[#084298] via-[#0B6EFD] to-blue-700 text-white py-16 px-4 sm:px-8 shadow-lg">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold border border-white/20">
              <Activity className="w-3.5 h-3.5 text-emerald-300" />
              <span>Prompt Medical Assistance • 24/7 Rapid Response</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              LifeLink eAmbulance <br />
              <span className="text-blue-200">Saving Lives with Smart Technology</span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl leading-relaxed">
              Connect immediately with specialized emergency vehicles across regional hospitals. Browse certified fleets, compare equipment & rates, or initiate a 1-touch SOS beacon.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/user/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <HeartPulse className="w-5 h-5 animate-pulse" />
                <span>Immediate Emergency SOS</span>
              </Link>
              <a
                href="tel:03011111234"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" />
                <span>Call Hotline: 030-1111-1234</span>
              </a>
            </div>
          </div>

          {/* Hero Quick Badge */}
          <div className="md:col-span-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="font-semibold text-blue-100">Live Active Fleet:</span>
              <span className="font-bold text-emerald-300 text-sm">6 Ready Units</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="font-semibold text-blue-100">Average Response Time:</span>
              <span className="font-bold text-white text-sm">6 - 8 Minutes</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="font-semibold text-blue-100">Coverage Sector:</span>
              <span className="font-bold text-white text-sm">Chicago Metropolitan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-100">Pricing Base:</span>
              <span className="font-bold text-amber-300 text-sm">From $12 / Request</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search, Sort & Filter Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1F2A37] flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-[#0B6EFD]" />
                <span>Available eAmbulance Listings</span>
              </h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Browse, search by region (e.g. "Chicago"), and filter by medical vehicle configuration
              </p>
            </div>

            {/* Price Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-[#6B7785] shrink-0">Sort by Cost:</span>
              <select
                value={sortByPrice}
                onChange={(e) => setSortByPrice(e.target.value)}
                className="w-full sm:w-auto text-xs bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-2 font-medium text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              >
                <option value="default">Default Order</option>
                <option value="asc">Price: Low to High ($12 first)</option>
                <option value="desc">Price: High to Low ($30 first)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#6B7785] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by region (e.g. Chicago, Downtown), model or unit number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
              {['ALL', 'ICCU', 'ICU', 'A/C', 'NON-A/C'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedType === type
                      ? 'bg-[#0B6EFD] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#1F2A37]'
                  }`}
                >
                  {type === 'ALL' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAmbulances.length > 0 ? (
            filteredAmbulances.map((amb) => (
              <div
                key={amb.id}
                className="bg-white border border-[#E2E8F0] hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#6B7785] bg-slate-100 px-2.5 py-1 rounded-lg">
                      {amb.vehicleNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        amb.type === 'ICCU'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : amb.type === 'ICU'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : amb.type === 'A/C'
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {amb.type} Class
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#1F2A37] mb-2 leading-snug hover:text-[#0B6EFD] transition">
                    <Link to={`/ambulances/${amb.id}`}>{amb.model}</Link>
                  </h3>

                  {/* Specifications */}
                  <div className="space-y-2 text-xs text-[#6B7785] mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#0B6EFD] shrink-0" />
                      <span>Region: <strong className="text-[#1F2A37]">{amb.region}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Size: {amb.size}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="font-semibold text-[#1F2A37] block mb-1">On-board Medical Equipment:</span>
                      <p className="text-[11px] leading-relaxed text-[#6B7785]">{amb.equipment}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price and Booking CTA */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#6B7785] block">Standard Rate</span>
                    <div className="text-xl font-black text-[#0B6EFD]">
                      ${amb.price} <span className="text-xs font-normal text-[#6B7785]">/ trip</span>
                    </div>
                  </div>

                  <Link
                    to={`/ambulances/${amb.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>Request Unit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white border border-[#E2E8F0] rounded-2xl">
              <Ambulance className="w-10 h-10 text-[#6B7785] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-[#1F2A37]">No eAmbulance matching criteria found</p>
              <p className="text-xs text-[#6B7785] mt-1">Try resetting your search region or category filter.</p>
            </div>
          )}
        </div>

        {/* Full Directory CTA Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-[#1F2A37]">
              Looking for Advanced Multi-Criteria Filtering & Sector Search?
            </h3>
            <p className="text-xs text-[#6B7785]">
              Inspect our comprehensive fleet directory with live rate budget sliders, chassis sizes, and instant pre-dispatch bookings.
            </p>
          </div>
          <Link
            to="/ambulances"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-xs shrink-0"
          >
            <span>Explore Full Fleet Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
