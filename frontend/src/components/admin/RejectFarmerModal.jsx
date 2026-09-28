import React, { useState, useEffect } from 'react';
import { X, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * RejectFarmerModal (Phase 4.15)
 * Prompts admin for mandatory rejection reason when declining a farmer stall application.
 */
export default function RejectFarmerModal({
  isOpen,
  onClose,
  onConfirm,
  farmer = null,
  submitting = false,
}) {
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setReason('');
    setValidationError('');
  }, [isOpen, farmer]);

  if (!isOpen || !farmer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 3) {
      setValidationError('Please provide a rejection reason of at least 3 characters.');
      return;
    }
    setValidationError('');
    onConfirm(farmer.id, reason.trim());
  };

  const farmName = farmer.stall_name || farmer.user?.fullname || 'Farmer Stall';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200 space-y-5 relative animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pb-3 border-b border-rose-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#0F172A]">Reject Stall Application</h3>
          <p className="text-xs text-[#475569]">
            Stall: <span className="font-bold text-[#0F172A]">{farmName}</span>
          </p>
        </div>

        {/* Warning Callout */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            The applicant will receive an in-app notification explaining why their stall application could not be approved at this time.
          </p>
        </div>

        {validationError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reject-reason-input" className="text-xs font-bold text-[#0F172A]">
              Rejection Reason *
            </label>
            <textarea
              id="reject-reason-input"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Missing required Illinois organic certification or invalid market location..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <span>Confirm Rejection</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
