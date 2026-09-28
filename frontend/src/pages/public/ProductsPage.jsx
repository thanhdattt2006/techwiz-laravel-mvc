import React, { useState } from 'react';
import { Sprout, Filter, RotateCcw } from 'lucide-react';
import { ProductCard, FilterSidebar } from '../../components/common';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';

/**
 * ProductsPage Component
 * Seasonal fresh produce and artisanal catalog with live backend filters.
 * Refactored to adhere to SOLID principles and clean component separation.
 */
export default function ProductsPage() {
  const {
    products,
    categories,
    markets,
    loading,
    categoriesLoading,
    marketsLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedMarketId,
    setSelectedMarketId,
    maxPrice,
    setMaxPrice,
    organicOnly,
    setOrganicOnly,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    hasActiveFilters,
    favoritedIds,
    toggleFavorite,
    resetFilters,
  } = useProducts();

  const { addToCart, openCart } = useCart();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleAddToCart = async (product) => {
    const ok = await addToCart(product.id, 1);
    if (ok) {
      openCart();
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans antialiased text-[#0F172A]">
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-bold text-[#0F172A] shadow-xs cursor-pointer"
          >
            <Filter className="w-4 h-4 text-[#16A34A]" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Filter & Search Produce'}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            )}
          </button>
          <span className="text-xs font-semibold text-[#475569]">
            {products.length} items available
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter Panel */}
          <aside
            className={`lg:col-span-4 xl:col-span-3 space-y-6 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="sticky top-24">
              <FilterSidebar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={categories}
                categoriesLoading={categoriesLoading}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                markets={markets}
                marketsLoading={marketsLoading}
                selectedMarket={selectedMarketId}
                onMarketChange={setSelectedMarketId}
                maxPrice={maxPrice}
                onMaxPriceChange={setMaxPrice}
                priceLimit={25}
                organicOnly={organicOnly}
                onOrganicOnlyChange={setOrganicOnly}
                inStockOnly={inStockOnly}
                onInStockOnlyChange={setInStockOnly}
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Right Product Grid & Sorting */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white border border-[#E2E8DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#475569]">
                  Showing <strong className="text-[#0F172A]">{products.length}</strong> fresh harvest listings
                </span>
                {selectedMarketId !== 'ALL' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    <span>Market: {markets.find((m) => m.id?.toString() === selectedMarketId?.toString())?.name || 'Selected'}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMarketId('ALL')}
                      className="hover:text-emerald-950 text-emerald-600 font-bold ml-0.5 cursor-pointer"
                      title="Clear market filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#475569] shrink-0">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3 py-2 font-medium text-[#0F172A] focus:outline-none focus:border-[#16A34A] cursor-pointer"
                >
                  <option value="default">Default Harvest Order</option>
                  <option value="price_asc">Price: Low to High ($)</option>
                  <option value="price_desc">Price: High to Low ($)</option>
                  <option value="rating_desc">Highest Customer Rating (★)</option>
                  <option value="name_asc">Alphabetical (A - Z)</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid with Skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white border border-[#E2E8DF] rounded-2xl h-80 p-5 animate-pulse flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-36 bg-slate-100 rounded-xl" />
                      <div className="h-4 w-28 bg-slate-200 rounded-md" />
                      <div className="h-5 w-48 bg-slate-200 rounded-md" />
                    </div>
                    <div className="h-8 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorited={favoritedIds.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                  />
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
                  Try adjusting your price range, choosing another market, or clearing your search query.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer"
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
