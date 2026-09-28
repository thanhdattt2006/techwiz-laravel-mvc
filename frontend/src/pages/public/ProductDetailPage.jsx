import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sprout,
  Heart,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useCart } from '../../context/CartContext';
import ProductStallInfoCard from '../../components/products/ProductStallInfoCard';
import ProductReviewsList from '../../components/products/ProductReviewsList';
import ProductOrderActionCard from '../../components/products/ProductOrderActionCard';

/**
 * ProductDetailPage (Phase 4.7 — Refactored Phase 5.1)
 * Live produce detail view integrated with Laravel REST API, real customer reviews,
 * stock-constrained quantity picker, and global cart / pre-order flows.
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const { openCheckout } = useCart();

  const {
    product, reviews, loading, error,
    quantity, maxStock, isFavorite, submittingCart,
    increaseQuantity, decreaseQuantity, setCustomQuantity,
    toggleFavorite, addToCart,
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
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Produce Listing Unavailable</h1>
        <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto">
          {error || `The harvest identifier "${id}" could not be retrieved from the market catalog.`}
        </p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Produce Catalog</span>
        </Link>
      </div>
    );
  }

  const isSoldOut = maxStock <= 0;
  const totalPrice = (quantity * (Number(product.price) || 0)).toFixed(2);
  const imageSrc = product.image || product.img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

  const handlePreOrderNow = async () => {
    const success = await addToCart();
    if (success) openCheckout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#475569]">
        <Link to="/products" className="text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Produce Catalog</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-[#0F172A] truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual, Details, Origin & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Showcase Card */}
          <div className="bg-white border border-[#E2E8DF] rounded-3xl overflow-hidden shadow-xs">
            <div className="h-80 sm:h-96 relative bg-slate-100 overflow-hidden">
              <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.category && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/70 text-white backdrop-blur">{product.category.name}</span>
                )}
                {isSoldOut ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs">Sold Out</span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-700 text-white shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-300" /><span>In Stock</span>
                  </span>
                )}
              </div>
              <button type="button" onClick={toggleFavorite} aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'} className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur text-slate-700 hover:text-rose-500 shadow-md transition transform hover:scale-105 cursor-pointer">
                <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
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
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-[#15803D] px-2.5 py-0.5 rounded-lg border border-emerald-200">Harvest #{product.id}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{product.name}</h1>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#16A34A]">${Number(product.price).toFixed(2)}</span>
                  <span className="text-sm text-[#475569] font-semibold">per {product.unit} (Direct Farm Gate Price)</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{product.description || 'Freshly harvested according to seasonal rhythms by our participating regional farmers.'}</p>
              <ProductStallInfoCard farmer={product.farmer} />
              {/* Harvest Guidelines */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#16A34A]" /><span>Harvest & Freshness Guidelines</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Harvest Window:</span>
                    <p className="text-[11px] text-[#475569]">Picked within 24-48 hours before weekend market sessions for peak nutritive density.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Storage Recommendation:</span>
                    <p className="text-[11px] text-[#475569]">Store in a cool, ventilated vegetable crisper. Wash gently with cold water prior to preparation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductReviewsList reviews={reviews} avgRating={product.avg_rating} reviewCount={product.review_count} />
        </div>

        {/* Right Column: Reservation Action Card (Delegated) */}
        <div className="lg:col-span-5 space-y-6">
          <ProductOrderActionCard
            product={product}
            quantity={quantity}
            maxStock={maxStock}
            isSoldOut={isSoldOut}
            totalPrice={totalPrice}
            submittingCart={submittingCart}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            setCustomQuantity={setCustomQuantity}
            addToCart={addToCart}
            onPreOrderNow={handlePreOrderNow}
          />
        </div>
      </div>
    </div>
  );
}
