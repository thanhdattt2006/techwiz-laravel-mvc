import React, { useState, useEffect } from 'react';
import { Star, Send, X, AlertCircle, CheckCircle2, Store, Sprout, Loader2 } from 'lucide-react';
import reviewApi from '../../api/reviewApi';
import { useModal } from '../../context/ModalContext';

/**
 * ReviewModal (Phase 4.11)
 * Modal to submit 1-5 star ratings and reviews for completed orders.
 * Strictly adheres to backend XOR target constraint (farmer stall OR produce item).
 */
export default function ReviewModal({ isOpen, onClose, order, onSuccess }) {
  const { showAlert } = useModal();

  const [targetType, setTargetType] = useState('farmer'); // 'farmer' | 'product'
  const [selectedProductId, setSelectedProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const items = Array.isArray(order?.items) ? order.items : [];
  const farmerName = order?.farmer?.stall_name || 'Farmer Stall';

  useEffect(() => {
    if (order) {
      setTargetType('farmer');
      setRating(5);
      setHoverRating(0);
      setComment('');
      if (items.length > 0) {
        setSelectedProductId(items[0].product_id || items[0].id || '');
      }
    }
  }, [order, items.length]);

  if (!isOpen || !order) return null;

  const isCompleted = order.status === 'completed';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCompleted) {
      showAlert({
        title: 'Order Incomplete',
        message: 'You can only submit reviews for pre-orders that have been collected and completed at the stall.',
        type: 'warning',
      });
      return;
    }

    const payload = {
      order_id: order.id,
      rating,
      comment: comment.trim() || null,
    };

    if (targetType === 'farmer') {
      payload.farmer_id = order.farmer_id || order.farmer?.id;
      payload.product_id = null;
    } else {
      payload.product_id = Number(selectedProductId);
      payload.farmer_id = null;
    }

    setSubmitting(true);
    try {
      await reviewApi.submitReview(payload);
      showAlert({
        title: 'Review Submitted',
        message: 'Thank you for supporting Chicago family farms! Your review directly inspires local growers.',
        type: 'success',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.order_id?.[0] || 'Failed to submit review.';
      showAlert({
        title: 'Submission Failed',
        message: msg,
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8DF] space-y-6 relative animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pb-4 border-b border-[#E2E8DF]">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <h3 className="text-xl font-black text-[#0F172A]">Review Harvest & Stall Experience</h3>
          <p className="text-xs text-[#475569]">
            Order #{order.order_code} • {order.pickup_date}
          </p>
        </div>

        {!isCompleted ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>Reviews are only unlocked after collecting your produce basket at the stall (status: completed).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Target Selection: Stall vs Item */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                What are you reviewing?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('farmer')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    targetType === 'farmer'
                      ? 'bg-emerald-50 text-[#16A34A] border-emerald-300 shadow-2xs'
                      : 'bg-white text-[#475569] border-[#E2E8DF] hover:bg-[#F8FAF6]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span className="truncate">Farmer Stall</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('product')}
                  disabled={items.length === 0}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
                    targetType === 'product'
                      ? 'bg-emerald-50 text-[#16A34A] border-emerald-300 shadow-2xs'
                      : 'bg-white text-[#475569] border-[#E2E8DF] hover:bg-[#F8FAF6]'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span className="truncate">Produce Item</span>
                </button>
              </div>
            </div>

            {/* Produce item selector if target is product */}
            {targetType === 'product' && items.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F172A]">Select Produce Item</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                  required
                >
                  {items.map((it) => (
                    <option key={it.id || it.product_id} value={it.product_id || it.id}>
                      {it.product_name || it.name} ({it.quantity} {it.unit})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Stars */}
            <div className="text-center space-y-2 py-2 bg-[#F8FAF6] rounded-2xl border border-[#E2E8DF]">
              <span className="text-xs font-bold text-[#475569] block">Your Rating</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition transform hover:scale-125 cursor-pointer focus:outline-hidden"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#16A34A] block">
                {rating === 5 && '★★★★★ Exceptional • Dawn fresh harvest'}
                {rating === 4 && '★★★★☆ Very Good • Great produce & service'}
                {rating === 3 && '★★★☆☆ Average • Satisfactory pickup'}
                {rating <= 2 && '★★☆☆☆ Fair • Needs improvement'}
              </span>
            </div>

            {/* Review Comment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F172A]">
                Comments & Harvest Feedback (Optional)
              </label>
              <textarea
                rows={3}
                maxLength={2000}
                placeholder="Share your thoughts on produce ripeness, aroma, packaging, or grower hospitality..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A] leading-relaxed"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
