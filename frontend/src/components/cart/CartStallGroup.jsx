import React from 'react';
import { Sprout, Store, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

/**
 * CartStallGroup
 * Renders a single farmer stall group inside the CartDrawer, with items and quantity controls.
 */
export default function CartStallGroup({ stall, loading, updateQuantity, removeItem, onPreOrder }) {
  return (
    <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-4 space-y-4 shadow-2xs">
      {/* Stall Group Header */}
      <div className="border-b border-slate-200/70 pb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#16A34A]" />
            <h4 className="text-xs font-black text-[#0F172A] tracking-tight">{stall.stall_name}</h4>
          </div>
          {stall.contact_person && (
            <p className="text-[11px] text-[#475569] pl-5">Grower: {stall.contact_person}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#15803D] bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
            ${Number(stall.stall_subtotal).toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onPreOrder(stall)}
            title={`Pre-Order from ${stall.stall_name}`}
            className="text-[10px] font-bold text-[#16A34A] hover:text-[#15803D] bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition cursor-pointer flex items-center gap-1"
          >
            <span>Pre-Order</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Stall Active Markets Note */}
      {Array.isArray(stall.markets) && stall.markets.length > 0 && (
        <div className="text-[11px] text-[#475569] flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/60">
          <Store className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">
            Pick up at: <strong>{stall.markets.map((m) => m.name).join(', ')}</strong>
          </span>
        </div>
      )}

      {/* Items in this Stall */}
      <div className="space-y-3">
        {stall.items?.map((item) => {
          const itemImg = item.product_image || '/images/categories/fresh-vegetables.webp';
          const itemPrice = Number(item.unit_price).toFixed(2);
          const itemSubtotal = Number(item.subtotal).toFixed(2);

          return (
            <div key={item.id} className="bg-white border border-[#E2E8DF] rounded-xl p-3 flex items-center gap-3">
              <img src={itemImg} alt={item.product_name} className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-[#0F172A] truncate">{item.product_name}</h5>
                <p className="text-[11px] text-[#475569]">${itemPrice} / {item.unit}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)} disabled={loading} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center font-bold text-xs transition cursor-pointer">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-xs text-[#0F172A] min-w-6 text-center">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)} disabled={loading || Number(item.quantity) >= Number(item.stock_quantity)} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center font-bold text-xs transition cursor-pointer">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-right space-y-2 shrink-0">
                <span className="text-xs font-black text-[#16A34A] block">${itemSubtotal}</span>
                <button type="button" onClick={() => removeItem(item.id)} disabled={loading} title="Remove item" className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
