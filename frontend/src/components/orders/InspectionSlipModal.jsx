import React, { useEffect } from 'react';
import { Receipt, Printer, X } from 'lucide-react';

/**
 * InspectionSlipModal
 * Itemized stall inspection and cash receipt slip ready for print and mobile display.
 */
export default function InspectionSlipModal({ order, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const items = Array.isArray(order.items) ? order.items : [];
  const totalAmount = Number(order.total_amount || 0).toFixed(2);
  const stallLocation = order.stall_location || 'Stall Booth';
  const marketName = order.market?.name || 'Farmers Market';
  const farmerName = order.farmer?.stall_name || 'Independent Grower';
  const pickupWindow = order.pickup_time_slot || `${order.pickup_start_time} - ${order.pickup_end_time}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs cursor-pointer"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8DF] space-y-6 relative animate-in fade-in zoom-in-95 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pb-4 border-b border-dashed border-[#CBD5E1]">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-2">
            <Receipt className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-[#0F172A]">Stall Inspection & Cash Slip</h3>
          <p className="text-xs text-[#475569]">
            Order Code: <span className="font-mono font-bold text-[#0F172A]">{order.order_code}</span>
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-[#475569]">Market & Stall:</span>
            <span className="font-bold text-[#0F172A]">
              {marketName} ({stallLocation})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#475569]">Grower / Farmer:</span>
            <span className="font-bold text-[#0F172A]">{farmerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#475569]">Scheduled Pickup:</span>
            <span className="font-bold text-[#16A34A]">
              {order.pickup_date} • {pickupWindow}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#475569]">Order Status:</span>
            <span className="font-bold uppercase tracking-wider text-[#0F172A]">
              {order.status}
            </span>
          </div>
        </div>

        {/* Produce breakdown */}
        <div className="border-t border-b border-[#E2E8DF] py-3 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
            Reserved Produce ({items.length} item{items.length === 1 ? '' : 's'})
          </p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {items.map((it, idx) => (
              <div key={it.id || idx} className="flex justify-between text-xs">
                <span>
                  {it.product_name || it.name}{' '}
                  <span className="text-[#475569] font-mono">
                    x{it.quantity} {it.unit}
                  </span>
                </span>
                <span className="font-bold text-[#0F172A]">
                  ${Number(it.subtotal || (Number(it.unit_price) * Number(it.quantity)) || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm font-black">
          <span>Total Due at Stall:</span>
          <span className="text-xl text-[#16A34A]">${totalAmount} USD</span>
        </div>

        <p className="text-[11px] text-[#475569] text-center bg-[#F8FAF6] p-3 rounded-xl border border-[#E2E8DF]">
          💡 <strong>Zero Online Payment Policy</strong>: Present this pass at the stall, inspect your produce, and settle payment in person using cash or card.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#16A34A]" />
            <span>Print Slip</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
