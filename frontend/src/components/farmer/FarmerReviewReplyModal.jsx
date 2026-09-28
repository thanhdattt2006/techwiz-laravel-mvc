import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Loader2, Star } from 'lucide-react';

/**
 * FarmerReviewReplyModal (Phase 4.14)
 * Allows farmer to write or edit a response to a customer's harvest produce review.
 */
export default function FarmerReviewReplyModal({
  isOpen,
  onClose,
  onSubmit,
  review = null,
  submitting = false,
}) {
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (review) {
      setReplyText(review.farmer_reply || '');
    } else {
      setReplyText('');
    }
    setError('');
  }, [review, isOpen]);

  if (!isOpen || !review) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.trim().length < 3) {
      setError('Please enter a response of at least 3 characters.');
      return;
    }
    setError('');
    onSubmit(replyText.trim());
  };

  const customerName = review.customer?.fullname || 'Shopper';
  const targetName = review.product?.name || 'Produce Item';
  const rating = Number(review.rating || 5);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E2E8DF] space-y-5 relative animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8DF]">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Reply to Customer Review</h3>
            <p className="text-xs text-[#475569]">Public response displayed beneath shopper review</p>
          </div>
        </div>

        {/* Original Review Snippet */}
        <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0F172A]">{customerName}</span>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-[#16A34A] font-semibold text-[11px]">Reviewed: {targetName}</p>
          <p className="text-[#475569] italic">"{review.comment || 'No comment provided.'}"</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reply-textarea" className="text-xs font-bold text-[#0F172A]">
              Farmer Response *
            </label>
            <textarea
              id="reply-textarea"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Thank you for visiting our stall! We're glad you enjoyed the fresh harvest..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden resize-none"
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Response</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
