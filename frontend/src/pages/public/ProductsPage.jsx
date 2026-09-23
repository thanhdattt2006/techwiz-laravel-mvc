import React, { useState, useMemo } from 'react';
import productsData from '../../data/products.json';
import marketsData from '../../data/markets.json';
import {
  Sprout,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Filter,
} from 'lucide-react';
import { ProductCard } from '../../components/common';

const CATEGORIES = [
  { id: 'ALL', label: 'All Harvest' },
  { id: 'VEGETABLES', label: 'Vegetables' },
  { id: 'FRUITS', label: 'Orchard Fruits' },
  { id: 'DAIRY', label: 'Dairy & Eggs' },
  { id: 'BAKERY', label: 'Artisan Bakery' },
  { id: 'PANTRY', label: 'Pantry & Honey' },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMarketId, setSelectedMarketId] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(15);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return productsData
      .filter((prod) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch =
          query === '' ||
          prod.name.toLowerCase().includes(query) ||
          prod.farmOrigin.toLowerCase().includes(query) ||
          prod.marketName.toLowerCase().includes(query) ||
          prod.description.toLowerCase().includes(query);

        const matchesCat =
          selectedCategory === 'ALL' || prod.category === selectedCategory;

        const matchesMarket =
          selectedMarketId === 'ALL' ||
          prod.marketId.toString() === selectedMarketId.toString();

        const matchesPrice = prod.price <= maxPrice;

        const matchesOrganic = !organicOnly || prod.isOrganic;

        const matchesStock = !inStockOnly || prod.stockQuantity > 0;

        return (
          matchesSearch &&
          matchesCat &&
          matchesMarket &&
          matchesPrice &&
          matchesOrganic &&
          matchesStock
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return a.id - b.id;
      });
  }, [
    searchTerm,
    selectedCategory,
    selectedMarketId,
    maxPrice,
    organicOnly,
    inStockOnly,
    sortBy,
  ]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'ALL' ||
    selectedMarketId !== 'ALL' ||
    maxPrice < 15 ||
    organicOnly ||
    inStockOnly ||
    sortBy !== 'default';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedMarketId('ALL');
    setMaxPrice(15);
    setOrganicOnly(false);
    setInStockOnly(false);
    setSortBy('default');
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#15803D] via-[#16A34A] to-emerald-700 text-white py-12 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold border border-white/20">
            <Sprout className="w-3.5 h-3.5 text-amber-300" />
            <span>Farm Fresh Just a Click Away • 100% Local Stall Pickup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Seasonal Fresh Produce & Artisanal Catalog
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed">
            Discover verified organic vegetables, tree-ripened fruits, raw honey, and craft sourdough from independent local growers. Pre-order ahead with zero online payment fees, and pick up fresh at your weekend market stall.
          </p>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-bold text-[#0F172A] shadow-xs"
          >
            <Filter className="w-4 h-4 text-[#16A34A]" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Filter & Search Produce'}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            )}
          </button>
          <span className="text-xs font-semibold text-[#475569]">
            {filteredProducts.length} items available
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter Panel */}
          <aside
            className={`lg:col-span-4 xl:col-span-3 space-y-6 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#16A34A]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Filter Harvest</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A] block">
                  Search Harvest
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="E.g. Heirloom, Apples, Honey..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* 2. Category Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] block">
                  Produce Category
                </label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const count =
                      cat.id === 'ALL'
                        ? productsData.length
                        : productsData.filter((p) => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          selectedCategory === cat.id
                            ? 'bg-emerald-50 text-[#16A34A] font-bold border border-emerald-200'
                            : 'text-[#475569] hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-[#475569]">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Market Location Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A] block">
                  Pickup Market
                </label>
                <select
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                  className="w-full text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3 py-2 text-[#0F172A] font-medium focus:outline-none focus:border-[#16A34A]"
                >
                  <option value="ALL">All Chicago Markets</option>
                  {marketsData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.neighborhood})
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Price Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F172A]">Max Price / Unit:</span>
                  <span className="font-black text-[#16A34A] text-sm">
                    ${maxPrice.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#16A34A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#475569]">
                  <span>$3.00</span>
                  <span>$15.00+</span>
                </div>
              </div>

              {/* 5. Quick Checkboxes */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#0F172A]">
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <span>USDA Organic Certified Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#0F172A]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <span>In Stock for Weekend Pickup Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid & Sorting */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white border border-[#E2E8DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#475569]">
                Showing <strong className="text-[#0F172A]">{filteredProducts.length}</strong> fresh harvest listings
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#475569] shrink-0">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3 py-2 font-medium text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
                >
                  <option value="default">Default Harvest Order</option>
                  <option value="price-asc">Price: Low to High ($)</option>
                  <option value="price-desc">Price: High to Low ($)</option>
                  <option value="rating-desc">Highest Customer Rating (★)</option>
                  <option value="name-asc">Alphabetical (A - Z)</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8DF] rounded-2xl p-12 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto">
                  <Sprout className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  No harvest items match your filters
                </h3>
                <p className="text-xs text-[#475569] max-w-sm mx-auto">
                  Try adjusting your price range, choosing another market, or clearing the search query.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
