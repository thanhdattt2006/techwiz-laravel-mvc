import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search, Sprout, ArrowRight } from 'lucide-react';
import { ProductCard } from '../common';

/**
 * HomeFreshHarvest Component
 * Search bar, category filter pills, price sort, and product cards grid.
 * Displays 3 rows (9 produce items max) with a "View All" link to catalog.
 */
export default function HomeFreshHarvest({
  products = [],
  categories = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  selectedCategory = 'ALL',
  onCategoryChange,
  sortByPrice = 'default',
  onSortByPriceChange,
}) {
  const defaultCategories = ['VEGETABLES', 'FRUITS', 'DAIRY', 'BAKERY', 'PANTRY'];
  const displayedProducts = products.slice(0, 9);

  return (
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
              onChange={(e) => onSortByPriceChange(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-[#E2E8DF] rounded-xl px-3 py-2 font-medium text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
            >
              <option value="default">Default Harvest Order</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search produce name, farm, or neighborhood market..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => onCategoryChange('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
              }`}
            >
              All Harvest
            </button>
            {categories.length > 0
              ? categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onCategoryChange(cat.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory.toUpperCase() === cat.name.toUpperCase()
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              : defaultCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onCategoryChange(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
          </div>
        </div>
      </div>

      {/* Harvest Grid with Loading Skeletons */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
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
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((item) => (
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
      )}

      {/* View All Produce Button */}
      {!loading && products.length > 0 && (
        <div className="mt-10 flex items-center justify-center">
          <Link
            to={selectedCategory !== 'ALL' ? `/products?category=${encodeURIComponent(selectedCategory)}` : '/products'}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs hover:shadow transition duration-200 cursor-pointer"
          >
            <span>View All Fresh Produce ({products.length} Items Available)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
