import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Store,
  MapPin,
  Sprout,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useCustomerFavorites } from '../../hooks/useCustomerFavorites';

/**
 * FavoritesTab (Phase 4.11)
 * Displays customer's favorited produce items, local farmers markets, and grower stalls.
 */
export default function FavoritesTab() {
  const {
    filteredFavorites,
    loading,
    error,
    filterType,
    setFilterType,
    counts,
    togglingId,
    removeFavorite,
    refetch,
  } = useCustomerFavorites();

  return (
    <div className="space-y-6">
      {/* Sub-Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          type="button"
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            filterType === 'ALL'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
          }`}
        >
          All Saved ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('product')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            filterType === 'product'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
          }`}
        >
          Produce Items ({counts.products})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('market')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            filterType === 'market'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
          }`}
        >
          Markets ({counts.markets})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('farmer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            filterType === 'farmer'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
          }`}
        >
          Farmer Stalls ({counts.farmers})
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#16A34A] mx-auto" />
          <p className="text-xs font-bold text-[#475569]">Loading your saved favorites...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">{error}</h3>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">No Saved Favorites Yet</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Tap the heart icon on any seasonal crop, market schedule, or grower stall to save it for quick weekend pre-orders.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Fresh Produce</span>
            </Link>
            <Link
              to="/markets"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8DF] bg-white hover:bg-slate-50 text-xs font-bold text-[#0F172A] transition"
            >
              <Store className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Explore Markets</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFavorites.map((fav) => {
            const type = fav.favoritable_type;
            const targetId = fav.favoritable_id;
            const item = fav.item || {};
            const isRemoving = togglingId === `${type}-${targetId}`;

            return (
              <div
                key={fav.id}
                className="bg-white border border-[#E2E8DF] rounded-2xl p-4 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-[#475569]">
                      {type === 'product' ? 'Seasonal Crop' : type === 'market' ? 'Farmers Market' : 'Farmer Stall'}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A] line-clamp-1">
                      {item.name || item.stall_name || 'Saved Item'}
                    </h4>
                    {type === 'product' && (
                      <p className="text-[11px] text-[#475569] flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>{item.farmer_name || 'Local Farm'}</span>
                      </p>
                    )}
                    {type === 'market' && (
                      <p className="text-[11px] text-[#475569] flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                        <span className="truncate">{item.address || item.city}</span>
                      </p>
                    )}
                    {type === 'farmer' && (
                      <p className="text-[11px] text-[#475569] flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>{item.contact_person || item.address}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFavorite(type, targetId)}
                    disabled={isRemoving}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition cursor-pointer disabled:opacity-50 shrink-0"
                    title="Remove from favorites"
                  >
                    {isRemoving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                    ) : (
                      <Heart className="w-4 h-4 fill-rose-500" />
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {type === 'product' && (
                    <span className="text-xs font-black text-[#0F172A]">
                      ${Number(item.price || 0).toFixed(2)}{' '}
                      <span className="text-[10px] font-normal text-[#475569]">/{item.unit || 'unit'}</span>
                    </span>
                  )}
                  {type !== 'product' && <div />}

                  <Link
                    to={type === 'product' ? `/products/${targetId}` : type === 'market' ? '/markets' : '/markets'}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] hover:underline"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
