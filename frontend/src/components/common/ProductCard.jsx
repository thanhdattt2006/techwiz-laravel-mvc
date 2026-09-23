import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, Clock, Star, ShoppingBag } from 'lucide-react';
import RatingStars from './RatingStars';

/**
 * ProductCard Component
 * Standardized reusable card for farm produce items across Home, Catalog, and Stall listings.
 *
 * @param {object} product - Produce product data
 * @param {boolean} _compact - Compact layout option
 * @param {function} onPreOrder - Optional callback when Pre-Order button is clicked
 */
export default function ProductCard({
  product,
  _compact = false,
  onPreOrder = null,
  className = '',
}) {
  if (!product) return null;

  const farmName = product.farmOrigin || product.farm || 'Local Family Farm';
  const marketLocation = product.marketName || product.market || 'City Farmers Market';
  const isOrganic = product.isOrganic || (product.tag && product.tag.toLowerCase().includes('organic'));
  const tagText = product.tag || (isOrganic ? 'USDA Organic' : null);
  const tagColor =
    product.tagColor ||
    (isOrganic
      ? 'bg-emerald-100 text-[#15803D] border-emerald-200'
      : 'bg-amber-100 text-amber-800 border-amber-200');

  const formattedPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;

  return (
    <div
      className={`bg-white border border-[#E2E8DF] hover:border-[#16A34A] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Product Image Section */}
        {product.image && (
          <div className="h-44 relative overflow-hidden bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              loading="lazy"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {tagText && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${tagColor}`}>
                  {tagText}
                </span>
              )}
              {product.category && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur">
                  {product.category}
                </span>
              )}
            </div>

            {/* Rating Overlay */}
            {product.rating && (
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur text-[11px] font-bold text-amber-700 flex items-center gap-1 shadow-xs">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-[10px] text-[#475569] font-normal">
                    ({product.reviewsCount})
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card Body Details */}
        <div className="p-5 space-y-3">
          {/* Header row when no image */}
          {!product.image && (
            <div className="flex items-center justify-between mb-2">
              {tagText ? (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tagColor}`}>
                  {tagText}
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#475569]">
                  {product.category || 'Produce'}
                </span>
              )}
              {product.rating && (
                <RatingStars
                  rating={product.rating}
                  reviewsCount={product.reviewsCount}
                  size="xs"
                />
              )}
            </div>
          )}

          {/* Farm Origin & Stall */}
          <div className="flex items-center justify-between text-[11px] text-[#475569]">
            <span className="font-semibold text-[#15803D] flex items-center gap-1 truncate max-w-[70%]">
              <Sprout className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              <span className="truncate">{farmName}</span>
            </span>
            {product.stallNumber && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded-md text-[#475569] shrink-0">
                {product.stallNumber}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#16A34A] transition line-clamp-1">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          {/* Description or Harvest Note */}
          {(product.description || product.harvestNote) && (
            <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
              {product.description || `"${product.harvestNote}"`}
            </p>
          )}

          {/* Location & Harvest Date Meta */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-[#475569] space-y-1">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">{marketLocation}</span>
            </div>
            {product.harvestDate && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Clock className="w-3 h-3 text-[#16A34A] shrink-0" />
                <span>{product.harvestDate}</span>
              </div>
            )}
            {product.stockStatus && (
              <div className="text-[11px] font-medium text-emerald-700">
                <span>{product.stockStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-[#E2E8DF] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase text-[#475569] block">
            Direct Farm Price
          </span>
          <div className="text-lg sm:text-xl font-black text-[#16A34A]">
            ${formattedPrice}{' '}
            <span className="text-xs font-normal text-[#475569]">
              / {product.unit || 'unit'}
            </span>
          </div>
        </div>

        {onPreOrder ? (
          <button
            type="button"
            onClick={() => onPreOrder(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pre-Order</span>
          </button>
        ) : (
          <Link
            to={`/products/${product.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pre-Order</span>
          </Link>
        )}
      </div>
    </div>
  );
}
