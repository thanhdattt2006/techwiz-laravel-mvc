import React, { useState } from 'react';
import { XCircle, X, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * DeclineOrderModal (Phase 4.12)
 * Prompts farmer for mandatory cancellation/decline reason.
 * Informs that reserved produce quantities will be immediately restored.
 */
export default function DeclineOrderModal({ order, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 3) {
      setValidationError('Please provide a reason of at least 3 characters.');
      return;
    }
    setValidationError('');
    onConfirm(order.id, reason.trim());
  };

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200 space-y-5 relative animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pb-3 border-b border-rose-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#0F172A]">Decline Pre-Order Reservation</h3>
          <p className="text-xs text-[#475569]">
            Order #{order.order_code} • Customer: <strong>{order.customer?.fullname || 'Customer'}</strong>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Automatic Inventory Restock</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Declining this order will automatically restore {items.length} reserved produce item(s) back into your stall inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="decline-reason" className="block text-xs font-bold text-[#0F172A]">
              Reason for Declining <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="decline-reason"
              rows={3}
              required
              placeholder="e.g. Harvest frost damage, crop sold out at dawn, booth closed early due to weather..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-rose-500 leading-relaxed"
            />
            {validationError && (
              <p className="text-[11px] text-rose-600 font-bold">{validationError}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              <span>{loading ? 'Declining...' : 'Confirm Decline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
