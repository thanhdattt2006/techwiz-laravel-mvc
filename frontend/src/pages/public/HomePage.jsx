import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Search,
  ArrowRight,
  PhoneCall,
  ShoppingBag,
  Award,
  Leaf,
  Store,
  MapPin,
  Star,
} from 'lucide-react';
import { ProductCard, MarketCard } from '../../components/common';

const FEATURED_MARKETS = [
  {
    id: 1,
    name: 'Lincoln Park Farmers Market',
    neighborhood: 'Lincoln Park, Chicago',
    address: 'Armitage Ave & Orchard St',
    operatingDays: 'Every Saturday',
    openingHours: '08:00 AM - 01:00 PM',
    stallsCount: 24,
    specialty: 'Organic Vegetables, Heirloom Tomatoes & Artisan Dairy',
    bgGradient: 'from-emerald-800 to-green-950',
  },
  {
    id: 2,
    name: 'Green City Market',
    neighborhood: 'Lincoln Park South, Chicago',
    address: '1817 N Clark St',
    operatingDays: 'Wed & Saturday',
    openingHours: '07:00 AM - 01:00 PM',
    stallsCount: 36,
    specialty: 'Orchard Fruits, Sweet Berries & Pastured Eggs',
    bgGradient: 'from-green-800 to-teal-950',
  },
  {
    id: 3,
    name: 'Logan Square Farmers Market',
    neighborhood: 'Logan Square, Chicago',
    address: '3107 W Logan Blvd',
    operatingDays: 'Every Sunday',
    openingHours: '08:30 AM - 02:00 PM',
    stallsCount: 30,
    specialty: 'Artisan Sourdough, Raw Wildflower Honey & Microgreens',
    bgGradient: 'from-amber-900 to-emerald-950',
  },
];

const SEASONAL_HARVEST = [
  {
    id: 1,
    name: 'Organic Heirloom Tomatoes',
    category: 'VEGETABLES',
    farm: 'Green Valley Organics',
    market: 'Lincoln Park Market',
    price: 4.5,
    unit: 'lb',
    tag: 'USDA Organic',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    harvestNote: 'Harvested fresh this morning at 05:30 AM',
    rating: 4.9,
    reviewsCount: 38,
    stockStatus: 'In Stock (18 lbs remaining)',
  },
  {
    id: 2,
    name: 'Crisp Honeycrisp Apples',
    category: 'FRUITS',
    farm: 'Sunny Ridge Orchards',
    market: 'Green City Market',
    price: 3.8,
    unit: 'lb',
    tag: 'Tree Ripened',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    harvestNote: 'Hand-picked from 25-year mature orchard',
    rating: 4.95,
    reviewsCount: 52,
    stockStatus: 'In Stock (35 lbs remaining)',
  },
  {
    id: 3,
    name: 'Raw Wildflower Honey Comb',
    category: 'PANTRY',
    farm: 'Prairie Blossom Apiary',
    market: 'Logan Square Market',
    price: 12.0,
    unit: 'jar',
    tag: 'Pure & Unfiltered',
    tagColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    harvestNote: 'Single-source raw nectar with comb slice',
    rating: 5.0,
    reviewsCount: 44,
    stockStatus: 'Only 8 jars left this week',
  },
  {
    id: 4,
    name: 'Pastured Free-Range Eggs',
    category: 'DAIRY',
    farm: 'Oakwood Farmsteads',
    market: 'Lincoln Park Market',
    price: 6.5,
    unit: 'dozen',
    tag: 'Pasture Raised',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    harvestNote: 'Foraged on open clover grass daily',
    rating: 4.92,
    reviewsCount: 29,
    stockStatus: 'In Stock (20 cartons)',
  },
  {
    id: 5,
    name: 'Artisan Sourdough Country Loaf',
    category: 'BAKERY',
    farm: 'Stone Ground Craft Bakery',
    market: 'Logan Square Market',
    price: 7.0,
    unit: 'loaf',
    tag: '36-Hr Fermented',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    harvestNote: 'Stone-milled organic wheat, wild sourdough yeast',
    rating: 4.98,
    reviewsCount: 67,
    stockStatus: 'Only 6 loaves remaining',
  },
  {
    id: 6,
    name: 'Sweet Tender Baby Spinach',
    category: 'VEGETABLES',
    farm: 'River Valley Greens',
    market: 'Green City Market',
    price: 3.2,
    unit: 'bundle',
    tag: 'Pesticide Free',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    harvestNote: 'Triple washed and hydro-cooled',
    rating: 4.88,
    reviewsCount: 23,
    stockStatus: 'In Stock (25 bundles)',
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortByPrice, setSortByPrice] = useState('default');

  const filteredHarvest = useMemo(() => {
    return SEASONAL_HARVEST.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchSearch && matchCat;
    }).sort((a, b) => {
      if (sortByPrice === 'asc') return a.price - b.price;
      if (sortByPrice === 'desc') return b.price - a.price;
      return 0;
    });
  }, [searchTerm, selectedCategory, sortByPrice]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
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

            {/* Hero Quick Action Buttons */}
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

      {/* Featured Local Markets Section */}
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
            <span>View All 6 Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_MARKETS.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* Main Produce Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search, Sort & Filter Bar */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[#16A34A]" />
                <span>Seasonal Fresh Harvest Highlights</span>
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                Reserve produce picked at peak ripeness directly from certified family farms
              </p>
            </div>

            {/* Price Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-[#475569] shrink-0">Sort Price:</span>
              <select
                value={sortByPrice}
                onChange={(e) => setSortByPrice(e.target.value)}
                className="w-full sm:w-auto text-xs bg-slate-50 border border-[#E2E8DF] rounded-xl px-3 py-2 font-medium text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
              >
                <option value="default">Default Harvest Order</option>
                <option value="asc">Price: Low to High ($3.20 first)</option>
                <option value="desc">Price: High to Low ($12.00 first)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search produce name, farm (e.g. Green Valley), or market..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
              {['ALL', 'VEGETABLES', 'FRUITS', 'DAIRY', 'BAKERY', 'PANTRY'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                  }`}
                >
                  {cat === 'ALL' ? 'All Harvest' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Harvest Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHarvest.length > 0 ? (
            filteredHarvest.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white border border-[#E2E8DF] rounded-2xl">
              <Sprout className="w-10 h-10 text-[#475569] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-[#0F172A]">No seasonal produce matching criteria found</p>
              <p className="text-xs text-[#475569] mt-1">Try resetting your search query or selecting "All Harvest".</p>
            </div>
          )}
        </div>
      </section>

      {/* How Pre-Order Works (3-Step Visual Process) */}
      <section className="bg-white border-y border-[#E2E8DF] py-16 px-4 sm:px-6 lg:px-8" id="how-it-works">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A]">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              How Pre-Ordering for Stall Pickup Works
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Guarantee your organic produce before market day arrives. No middleman markups, no online payment hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-6 relative flex flex-col items-center text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/20">
                1
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Discover Local Markets</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Explore Chicago farmers markets, view operating weekend days, and browse verified stalls with weekly fresh inventory.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-6 relative flex flex-col items-center text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
                2
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Pre-Order Ahead</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Choose your harvest items and select a convenient morning pickup window (e.g. 08:00 AM - 10:00 AM) to lock in your order.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-6 relative flex flex-col items-center text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-800/20">
                3
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Pick Up at Stall & Pay</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Visit the farmer's stall on market day, inspect your freshly packed produce basket, and settle with cash or card directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Spotlight & Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Spotlight Story */}
          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-900 to-[#15803D] text-white p-8 rounded-3xl shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Grower Spotlight of the Week</span>
            </div>
            <h3 className="text-2xl font-black leading-snug">
              "MarketLink lets us pick only what's needed at peak ripeness."
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Meet Thomas Miller, 3rd-generation grower at Green Valley Organics. By receiving pre-orders on MarketLink prior to Saturday morning, his family farm reduced post-market spoilage by 95% while customers get produce harvested just hours before pickup.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-sm">
                TM
              </div>
              <div>
                <div className="text-xs font-bold text-white">Thomas Miller</div>
                <div className="text-[11px] text-emerald-200">Green Valley Organics • Lincoln Park Market</div>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Sarah Jenkins (Lincoln Park)</span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                "I never miss out on heirloom tomatoes anymore! Reserving on Thursday evening means my basket is already packed when I walk over Saturday morning."
              </p>
            </div>

            <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">David Chen (Logan Square)</span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                "Direct connection with local beekeepers and bakers is amazing. The raw wildflower honey and sourdough are fresher than anything you can buy in a grocery store."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

