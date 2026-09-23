import React, { useState } from 'react';
import { ShieldCheck, MapPin, Sparkles, Store, Leaf, Wheat, Apple } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Organic Heirloom Rainbow Tomatoes',
    category: 'Vegetables',
    desc: 'Picked fresh at dawn from sun-drenched vine rows. Bursting with sweet heirloom acidity and vibrant colors.',
    market: 'Lincoln Park Farmers Market',
    farm: 'Green Valley Organics',
    badge: 'USDA Organic Certified',
    gradient: 'from-emerald-800 via-green-900 to-emerald-950',
    icon: 'leaf',
  },
  {
    id: 2,
    title: 'Tree-Ripened Honeycrisp Apples & Peaches',
    category: 'Fruits',
    desc: 'Crisp, juicy autumn apples and heritage summer peaches grown on 25-year mature orchard rootstocks.',
    market: 'Green City Market',
    farm: 'Sunny Ridge Orchards',
    badge: 'Hand-Picked Orchard Grade',
    gradient: 'from-amber-800 via-yellow-900 to-amber-950',
    icon: 'apple',
  },
  {
    id: 3,
    title: 'Single-Source Raw Wildflower Honey Comb',
    category: 'Pantry',
    desc: '100% unfiltered raw honey cut directly from clean natural comb frames, retaining all medicinal propolis.',
    market: 'Logan Square Farmers Market',
    farm: 'Prairie Blossom Apiary',
    badge: 'Raw & Unpasteurized',
    gradient: 'from-yellow-700 via-amber-900 to-yellow-950',
    icon: 'sparkles',
  },
  {
    id: 4,
    title: 'Artisan Farmhouse Goat Cheese & Cultured Butter',
    category: 'Dairy',
    desc: 'Small-batch pastured goat milk cheese rolled in edible herbs, paired with slow-churned sea-salt butter.',
    market: 'Lincoln Park Market',
    farm: 'Clover Hill Creamery',
    badge: 'Pasture-Raised Heritage Breed',
    gradient: 'from-teal-800 via-emerald-900 to-teal-950',
    icon: 'store',
  },
  {
    id: 5,
    title: 'Wood-Fired Rustic Sourdough Boule',
    category: 'Bakery',
    desc: 'Crusty hearth sourdough naturally fermented for 36 hours using organic Illinois stone-milled heirloom wheat.',
    market: 'Logan Square Market',
    farm: 'Stone Ground Craft Bakery',
    badge: '36-Hr Wild Yeast Ferment',
    gradient: 'from-amber-900 via-orange-950 to-stone-900',
    icon: 'wheat',
  },
  {
    id: 6,
    title: 'Hydroponic Sweet Baby Greens & Edible Blooms',
    category: 'Vegetables',
    desc: 'Crisp tender baby arugula, sweet butter lettuce, and edible viola flowers grown in pure spring water.',
    market: 'Loop Green Market',
    farm: 'River Valley Greens',
    badge: 'Zero Synthetic Pesticides',
    gradient: 'from-emerald-700 via-green-800 to-emerald-950',
    icon: 'leaf',
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('ALL');

  const items = GALLERY_ITEMS.filter(
    (item) => filter === 'ALL' || item.category.toUpperCase() === filter.toUpperCase()
  );

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'apple':
        return <Apple className="w-16 h-16 text-amber-200 group-hover:scale-110 transition duration-300" />;
      case 'sparkles':
        return <Sparkles className="w-16 h-16 text-yellow-200 group-hover:scale-110 transition duration-300" />;
      case 'wheat':
        return <Wheat className="w-16 h-16 text-amber-200 group-hover:scale-110 transition duration-300" />;
      case 'store':
        return <Store className="w-16 h-16 text-emerald-200 group-hover:scale-110 transition duration-300" />;
      default:
        return <Leaf className="w-16 h-16 text-emerald-200 group-hover:scale-110 transition duration-300" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
          Visual Documentation • Harvest & Stalls
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
          Farmers Market & Fresh Harvest Gallery
        </h1>
        <p className="text-xs sm:text-sm text-[#475569]">
          Explore certified sustainable family growers, weekly farmers market stalls, and peak-season harvests across Chicago.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'VEGETABLES', 'FRUITS', 'DAIRY', 'BAKERY', 'PANTRY'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === cat
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white border border-[#E2E8DF] text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Harvest' : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E2E8DF] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            {/* Visual Header Block */}
            <div className={`h-48 bg-gradient-to-br ${item.gradient} flex flex-col items-center justify-center p-6 text-white relative overflow-hidden`}>
              {renderIcon(item.icon)}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-bold tracking-wider">
                {item.category}
              </div>
              <div className="absolute bottom-3 left-3 text-[11px] font-medium text-emerald-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{item.market}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider block">
                {item.farm}
              </span>
              <h3 className="text-sm font-bold text-[#0F172A] leading-snug">{item.title}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">{item.desc}</p>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#475569]">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" /> {item.badge}
              </span>
              <span className="font-mono text-[11px] text-slate-400">Fresh Harvest</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

