import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sprout,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useCart } from '../../context/CartContext';
import ProductStallInfoCard from '../../components/products/ProductStallInfoCard';
import ProductReviewsList from '../../components/products/ProductReviewsList';

/**
 * ProductDetailPage (Phase 4.7)
 * Live produce detail view integrated with Laravel REST API, real customer reviews,
 * stock-constrained quantity picker, and global cart / pre-order flows.
 * Mock autofill and random code generators have been completely purged.
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openCheckout } = useCart();

  const {
    product,
    reviews,
    loading,
    error,
    quantity,
    maxStock,
    isFavorite,
    submittingCart,
    increaseQuantity,
    decreaseQuantity,
    setCustomQuantity,
    toggleFavorite,
    addToCart,
  } = useProductDetail(id);

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-4 w-40 bg-slate-200 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-80 sm:h-96 bg-slate-200 rounded-3xl" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-48 bg-slate-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-96 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Not Found State
  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
          Produce Listing Unavailable
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto">
          {error || `The harvest identifier "${id}" could not be retrieved from the market catalog.`}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Produce Catalog</span>
        </Link>
      </div>
    );
  }

  const isSoldOut = maxStock <= 0;
  const totalPrice = (quantity * (Number(product.price) || 0)).toFixed(2);
  const imageSrc =
    product.image ||
    product.img ||
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

  // Handler for Pre-Order Now button
  const handlePreOrderNow = async () => {
    const success = await addToCart();
    if (success) {
      openCheckout();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Breadcrumb Link */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#475569]">
        <Link to="/products" className="text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Produce Catalog</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-[#0F172A] truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Showcase, Details, Origin & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Showcase Card */}
          <div className="bg-white border border-[#E2E8DF] rounded-3xl overflow-hidden shadow-xs">
            <div className="h-80 sm:h-96 relative bg-slate-100 overflow-hidden">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.category && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/70 text-white backdrop-blur">
                    {product.category.name}
                  </span>
                )}
                {isSoldOut ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                    Sold Out
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-700 text-white shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-300" />
                    <span>In Stock</span>
                  </span>
                )}
              </div>

              {/* Bookmark Heart Button */}
              <button
                type="button"
                onClick={toggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur text-slate-700 hover:text-rose-500 shadow-md transition transform hover:scale-105 cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
                  }`}
                />
              </button>
            </div>

            {/* Produce Header & Narrative */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs text-[#475569] mb-1.5">
                  <span className="font-semibold text-[#15803D] flex items-center gap-1">
                    <Sprout className="w-4 h-4 text-[#16A34A]" />
                    {product.farmer?.stall_name || 'Independent Local Farm'}
                  </span>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-[#15803D] px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    Harvest #{product.id}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#16A34A]">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-[#475569] font-semibold">
                    per {product.unit} (Direct Farm Gate Price)
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {product.description || 'Freshly harvested according to seasonal rhythms by our participating regional farmers.'}
              </p>

              {/* Farm Origin & Registered Stalls */}
              <ProductStallInfoCard farmer={product.farmer} />

              {/* Harvest & Storage Guidelines */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Harvest & Freshness Guidelines</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Harvest Window:</span>
                    <p className="text-[11px] text-[#475569]">
                      Picked within 24-48 hours before weekend market sessions for peak nutritive density.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Storage Recommendation:</span>
                    <p className="text-[11px] text-[#475569]">
                      Store in a cool, ventilated vegetable crisper. Wash gently with cold water prior to preparation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Feedback */}
          <ProductReviewsList
            reviews={reviews}
            avgRating={product.avg_rating}
            reviewCount={product.review_count}
          />
        </div>

        {/* Right Column: Reservation & Action Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 sticky top-24">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
                <span>Reserve Produce</span>
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                Lock in farm-fresh stock ahead of weekend market day rush
              </p>
            </div>

            {/* Zero Payment Policy Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-[#15803D] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Zero Online Payment Fees</strong>: Inspect your produce basket in person at the stall and settle directly with the farmer using cash or card.
              </p>
            </div>

            {/* Inventory Status Pill */}
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8DF]">
              <span className="text-[#475569] font-medium">Stall Inventory:</span>
              {isSoldOut ? (
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                  Sold Out
                </span>
              ) : (
                <span className="font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {maxStock} {product.unit}s Available
                </span>
              )}
            </div>

            {/* Quantity Picker */}
            {!isSoldOut && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>Reservation Quantity ({product.unit}s):</span>
                  <span className="text-xs text-[#475569]">Max: {maxStock}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-[#0F172A] flex items-center justify-center font-bold text-sm transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={maxStock}
                    value={quantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    className="flex-1 text-center font-black text-lg text-[#0F172A] bg-[#F8FAF6] border border-[#E2E8DF] py-2 rounded-xl focus:outline-none focus:border-[#16A34A]"
                  />

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= maxStock}
                    aria-label="Increase quantity"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-[#0F172A] flex items-center justify-center font-bold text-sm transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Price Calculation Summary */}
            <div className="pt-3 border-t border-[#E2E8DF] bg-[#F8FAF6] -mx-6 -mb-6 p-6 rounded-b-3xl space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#475569]">
                  <span>Unit Price:</span>
                  <span>${Number(product.price).toFixed(2)} × {quantity}</span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>Stall Pickup Service Fee:</span>
                  <span className="text-[#16A34A] font-bold">$0.00 (Free Pickup)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#0F172A] pt-2 border-t border-slate-200">
                  <span>Estimated Total:</span>
                  <span className="text-xl text-[#16A34A]">${totalPrice}</span>
                </div>
                <p className="text-[11px] text-[#475569] italic">
                  Payable directly to {product.farmer?.stall_name || 'farmer stall'} on market day.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={isSoldOut || submittingCart}
                  className="w-full py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {submittingCart
                      ? 'Adding to Basket...'
                      : isSoldOut
                      ? 'Out of Stock'
                      : 'Add to Market Basket'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handlePreOrderNow}
                  disabled={isSoldOut || submittingCart}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Pre-Order Now (Reserve Pickup)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
