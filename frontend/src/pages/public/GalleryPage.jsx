import React, { useState } from 'react';
import { Ambulance, Camera, ShieldCheck, ZoomIn } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Mercedes Sprinter Intensive Cardiac Unit (ICCU)',
    category: 'ICCU Class',
    desc: 'Equipped with 12-lead ECG telemetry, mechanical CPR, and arterial line monitoring.',
    region: 'Chicago Central Base',
  },
  {
    id: 2,
    title: 'Ford Transit Advanced Life Support (ALS)',
    category: 'ICU Class',
    desc: 'High-mobility urban rescue van designed for rapid downtown transit.',
    region: 'Chicago Downtown',
  },
  {
    id: 3,
    title: 'Freightliner Heavy Rescue Command Vehicle',
    category: 'ICCU Class',
    desc: 'Full-capability mobile medical trailer for multi-casualty incidents.',
    region: 'Regional Sector',
  },
  {
    id: 4,
    title: 'Dual-Zone Air Conditioned Patient Van (A/C)',
    category: 'A/C Transport',
    desc: 'Climate-controlled compartment optimized for neonate and elderly transfers.',
    region: 'North Shore Hub',
  },
  {
    id: 5,
    title: 'Toyota HiAce First Response Unit',
    category: 'Non-A/C Standard',
    desc: 'Lightweight rapid intervention vehicle for congested street access.',
    region: 'South Chicago',
  },
  {
    id: 6,
    title: 'RAM ProMaster Advanced Trauma Care Suite',
    category: 'ICU Class',
    desc: 'Electric stretcher loader and continuous suction trauma bay.',
    region: 'Suburban Loop',
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('ALL');

  const items = GALLERY_ITEMS.filter(
    (item) => filter === 'ALL' || item.category.toUpperCase().includes(filter.toUpperCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-[#0B6EFD]">
          Visual Documentation
        </span>
        <h1 className="text-3xl font-black tracking-tight text-[#1F2A37]">
          eAmbulance Fleet Image Gallery
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7785]">
          Explore certified medical transport vehicles, on-board intensive care amenities, and rapid response units.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'ICCU', 'ICU', 'A/C'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === cat
                ? 'bg-[#0B6EFD] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#1F2A37] hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Vehicles' : `${cat} Models`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            {/* Visual Graphic Placeholder */}
            <div className="h-48 bg-gradient-to-br from-blue-900 via-[#084298] to-[#0B6EFD] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
              <Ambulance className="w-16 h-16 text-blue-200 group-hover:scale-110 transition duration-300" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-bold tracking-wider">
                {item.category}
              </div>
              <div className="absolute bottom-3 left-3 text-[11px] font-medium text-blue-200">
                {item.region}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-2">
              <h3 className="text-sm font-bold text-[#1F2A37] leading-snug">{item.title}</h3>
              <p className="text-xs text-[#6B7785] leading-relaxed">{item.desc}</p>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#6B7785]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified Inspection
              </span>
              <span className="font-mono text-[11px]">HD Photo Available</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
