import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ambulancesData from '../../data/ambulances.json';
import {
  Ambulance,
  Search,
  MapPin,
  Activity,
  ArrowRight,
  RotateCcw,
  HeartPulse,
  Navigation,
} from 'lucide-react';

export default function AmbulancesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(35);
  const [sortBy, setSortBy] = useState('default');

  // Image mapping for vehicle types
  const getImageForType = (type) => {
    switch (type) {
      case 'ICCU':
        return 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80';
      case 'ICU':
        return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80';
      case 'A/C':
        return 'https://images.unsplash.com/photo-1583912267670-6575ad4736f8?auto=format&fit=crop&w=1200&q=80';
      case 'Non-A/C':
        return 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80';
      default:
        return 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80';
    }
  };

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'ICCU':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ICU':
        return 'bg-blue-100 text-[#0B6EFD] border-blue-200';
      case 'A/C':
        return 'bg-emerald-100 text-[#198754] border-emerald-200';
      case 'Non-A/C':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Filtered & sorted ambulance fleet
  const filteredAmbulances = useMemo(() => {
    return ambulancesData
      .filter((amb) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch =
          query === '' ||
          amb.vehicleNumber.toLowerCase().includes(query) ||
          amb.model.toLowerCase().includes(query) ||
          amb.equipment.toLowerCase().includes(query) ||
          amb.region.toLowerCase().includes(query);

        const matchesType =
          selectedType === 'ALL' || amb.type.toUpperCase() === selectedType.toUpperCase();

        const matchesRegion =
          selectedRegion === 'ALL' || amb.region.toLowerCase() === selectedRegion.toLowerCase();

        const matchesPrice = amb.price <= maxPrice;

        return matchesSearch && matchesType && matchesRegion && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'model-asc') return a.model.localeCompare(b.model);
        return a.id - b.id;
      });
  }, [searchTerm, selectedType, selectedRegion, maxPrice, sortBy]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedType !== 'ALL' ||
    selectedRegion !== 'ALL' ||
    maxPrice < 35 ||
    sortBy !== 'default';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setSelectedRegion('ALL');
    setMaxPrice(35);
    setSortBy('default');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#084298] via-[#0B6EFD] to-blue-700 text-white py-12 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold border border-white/20">
              <Activity className="w-3.5 h-3.5 text-emerald-300" />
              <span>Certified Fleet Inventory • 24/7 Emergency Dispatch</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              LifeLink Ambulance Fleet Directory
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Explore specialized medical response vehicles across Chicago sectors. Filter by ICU/ICCU capabilities, operational coverage, medical onboard gear, and certified hourly dispatch rates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/user/dashboard"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5"
            >
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span>1-Touch SOS Beacon</span>
            </Link>
            <a
              href="tel:03011111234"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs transition"
            >
              <span>Hotline: 030-1111-1234</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Control Station */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-6">
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-[#6B7785] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vehicle code (e.g. AMB-CHI-101), chassis model, equipment (Ventilator, ECG), or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 text-xs sm:text-sm bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] placeholder-[#6B7785] focus:outline-none focus:border-[#0B6EFD] focus:ring-1 focus:ring-[#0B6EFD] transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6B7785] hover:text-[#DC3545] px-1.5 py-0.5 rounded cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-[#E2E8F0]">
            {/* 1. Vehicle Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
                Fleet Category
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              >
                <option value="ALL">All Categories ({ambulancesData.length})</option>
                <option value="ICCU">ICCU (Intensive Coronary Care)</option>
                <option value="ICU">ICU (Intensive Care Unit)</option>
                <option value="A/C">A/C (Air Conditioned)</option>
                <option value="Non-A/C">Non-A/C (Standard Transit)</option>
              </select>
            </div>

            {/* 2. Region / Sector Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
                Deployment Sector
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              >
                <option value="ALL">All Chicago Sectors</option>
                <option value="Chicago Central">Chicago Central</option>
                <option value="Chicago Downtown">Chicago Downtown</option>
                <option value="North Chicago">North Chicago</option>
                <option value="South Chicago Sector">South Chicago Sector</option>
                <option value="West Chicago Suburbs">West Chicago Suburbs</option>
              </select>
            </div>

            {/* 3. Max Hourly Rate Range */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
                  Max Rate / Trip
                </label>
                <span className="text-xs font-bold text-[#0B6EFD] font-mono">
                  ${maxPrice} / hr
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0B6EFD] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-[#6B7785]">
                <span>Min: $10</span>
                <span>Max: $35</span>
              </div>
            </div>

            {/* 4. Sort Ordering */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
                Sort Ordering
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              >
                <option value="default">Default Fleet Sequence</option>
                <option value="price-asc">Rate: Lowest to Highest</option>
                <option value="price-desc">Rate: Highest to Lowest</option>
                <option value="model-asc">Vehicle Model (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#6B7785] font-semibold">Active filters:</span>
              {selectedType !== 'ALL' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0B6EFD] border border-blue-200 font-medium">
                  Type: {selectedType}
                  <button
                    type="button"
                    onClick={() => setSelectedType('ALL')}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedRegion !== 'ALL' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0B6EFD] border border-blue-200 font-medium">
                  Sector: {selectedRegion}
                  <button
                    type="button"
                    onClick={() => setSelectedRegion('ALL')}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {maxPrice < 35 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0B6EFD] border border-blue-200 font-medium">
                  Rate ≤ ${maxPrice}
                  <button
                    type="button"
                    onClick={() => setMaxPrice(35)}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0B6EFD] border border-blue-200 font-medium">
                  Keyword: "{searchTerm}"
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {!hasActiveFilters && (
                <span className="text-[#6B7785] italic">Showing entire certified inventory</span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#1F2A37] font-semibold text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#6B7785]" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </section>

        {/* Results Metrics Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6B7785] px-1">
          <p>
            Showing <strong className="text-[#1F2A37] font-bold">{filteredAmbulances.length}</strong> of{' '}
            <strong className="text-[#1F2A37] font-bold">{ambulancesData.length}</strong> certified emergency vehicles stationed in Chicago.
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Units Inspected & Fully Equipped
            </span>
          </div>
        </div>

        {/* Fleet Grid */}
        {filteredAmbulances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAmbulances.map((amb) => {
              const equipmentList = amb.equipment.split(',').map((e) => e.trim());
              return (
                <div
                  key={amb.id}
                  className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Vehicle Image Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={getImageForType(amb.type)}
                      alt={amb.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-xs ${getTypeBadgeStyle(
                          amb.type
                        )}`}
                      >
                        {amb.type} Unit
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Available
                      </span>
                    </div>

                    {/* Bottom Image Info */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-mono tracking-wider bg-black/60 backdrop-blur px-2 py-0.5 rounded text-blue-200 border border-white/20">
                        {amb.vehicleNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1 drop-shadow-sm line-clamp-1">
                        {amb.model}
                      </h3>
                    </div>
                  </div>

                  {/* Vehicle Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Specs Row */}
                      <div className="flex items-center justify-between text-xs text-[#6B7785] pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0B6EFD]" />
                          <span className="font-semibold text-[#1F2A37]">{amb.region}</span>
                        </div>
                        <span className="text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {amb.size}
                        </span>
                      </div>

                      {/* Equipment List Tags */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7785] block">
                          Certified Equipment
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {equipmentList.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded bg-[#F5F8FC] border border-[#E2E8F0] text-[#1F2A37] font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[#6B7785] uppercase tracking-wider font-semibold block">
                          Base Dispatch Fee
                        </span>
                        <div className="text-lg font-black text-[#1F2A37]">
                          ${amb.price}{' '}
                          <span className="text-xs font-medium text-[#6B7785]">/ trip</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/tracking/${amb.vehicleNumber}`}
                          title="Simulate Live Tracking"
                          className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0B6EFD] hover:bg-blue-100 transition"
                        >
                          <Navigation className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/ambulances/${amb.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          <span>Pre-dispatch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0B6EFD] flex items-center justify-center mx-auto border border-blue-200">
              <Ambulance className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2A37]">
              No Ambulances Matched Your Criteria
            </h2>
            <p className="text-xs text-[#6B7785] leading-relaxed">
              We couldn't locate any active emergency vehicles matching your current sector, budget, or equipment filters. Try expanding your price boundary or clear your search keyword.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
