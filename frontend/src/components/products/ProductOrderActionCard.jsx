import React from 'react';
import { ShoppingBag, Plus, Minus, Info, Calendar } from 'lucide-react';

/**
 * ProductOrderActionCard
 * Right-sidebar reservation card with quantity picker, price summary, and action buttons.
 * Extracted from ProductDetailPage to comply with SRP (< 230 lines per file).
 */
export default function ProductOrderActionCard({
  product,
  quantity,
  maxStock,
  isSoldOut,
  totalPrice,
  submittingCart,
  increaseQuantity,
  decreaseQuantity,
  setCustomQuantity,
  addToCart,
  onPreOrderNow,
}) {
  return (
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
            onClick={onPreOrderNow}
            disabled={isSoldOut || submittingCart}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Pre-Order Now (Reserve Pickup)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
