import React from 'react';
import { Edit2, Trash2, Sprout, Loader2, DollarSign } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80';

/**
 * FarmerProductCard (Phase 4.13)
 * Renders an individual produce item in the farmer's inventory with
 * live stock +/- adjusters, availability pill toggles, and edit/delete actions.
 */
export default function FarmerProductCard({
  product,
  onEdit,
  onDelete,
  onAdjustStock,
  onToggleAvailability,
  loadingId,
}) {
  const isLoading = loadingId === product.id;
  const stockQty = Number(product.stock_quantity || 0);
  const price = Number(product.price || 0).toFixed(2);
  const categoryName = product.category?.name || 'Produce';

  return (
    <div className="relative bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-4.5 space-y-4 hover:border-emerald-300 transition shadow-2xs">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs rounded-2xl z-10 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-[#16A34A] animate-spin" />
        </div>
      )}

      {/* Top Details */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-13 h-13 rounded-xl object-cover border border-[#E2E8DF] shrink-0"
          />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wide">
              {categoryName}
            </span>
            <h4 className="text-sm font-bold text-[#0F172A] line-clamp-1">{product.name}</h4>
            <p className="text-[11px] text-[#475569] line-clamp-1">
              {product.description || 'Fresh harvest ready for pickup'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-sm font-black text-[#16A34A] block">
            ${price}
          </span>
          <span className="text-[10px] text-slate-400 font-bold block">per {product.unit}</span>
        </div>
      </div>

      {/* Stock Quantity Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#E2E8DF]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#475569]">Stock:</span>
          <div className="inline-flex items-center border border-[#E2E8DF] rounded-xl bg-white shadow-2xs">
            <button
              type="button"
              disabled={stockQty <= 0 || isLoading}
              onClick={() => onAdjustStock(product, -1)}
              className="px-2.5 py-1 text-xs font-bold text-[#475569] hover:bg-slate-100 rounded-l-xl transition cursor-pointer disabled:opacity-40"
              aria-label="Decrease stock"
            >
              -
            </button>
            <span className="px-3 py-1 text-xs font-bold text-[#0F172A] font-mono min-w-14 text-center">
              {stockQty} {product.unit}
            </span>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onAdjustStock(product, 1)}
              className="px-2.5 py-1 text-xs font-bold text-[#475569] hover:bg-slate-100 rounded-r-xl transition cursor-pointer disabled:opacity-40"
              aria-label="Increase stock"
            >
              +
            </button>
          </div>
        </div>

        {/* Status Toggle Pills */}
        <div className="flex items-center gap-1 self-start sm:self-auto">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onToggleAvailability(product, 'available')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              product.availability === 'available'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-slate-50'
            }`}
          >
            Available
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onToggleAvailability(product, 'sold_out')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              product.availability === 'sold_out'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-slate-50'
            }`}
          >
            Sold Out
          </button>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF]/60 text-xs">
        <span className="text-[11px] text-slate-400">
          Rating: <strong className="text-[#0F172A]">{Number(product.avg_rating || 5.0).toFixed(1)}★</strong> ({product.review_count || 0})
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#16A34A] hover:bg-emerald-50 transition cursor-pointer"
            title="Edit produce details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Delete produce from stall"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
