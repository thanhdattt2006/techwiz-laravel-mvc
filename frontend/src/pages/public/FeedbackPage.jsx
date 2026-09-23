import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, Send, CheckCircle2, Sprout } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import marketsData from '../../data/markets.json';

export default function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const initialRequestId = searchParams.get('requestId') || '';

  const { showAlert } = useModal();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [orderCode, setOrderCode] = useState(initialRequestId);
  const [shopperName, setShopperName] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState('mkt-02');
  const [feedbackAspect, setFeedbackAspect] = useState('Produce Freshness & Flavor');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ASPECT_OPTIONS = [
    'Produce Freshness & Flavor',
    'Farmer Courtesy & Warmth',
    'Accurate Tote Packing',
    'Pickup Punctuality & Ease',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showAlert({
        title: 'Review Required',
        message: 'Please share a brief comment about your produce quality or stall pickup experience.',
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showAlert({
        title: 'Review Published',
        message: 'Thank you for supporting Chicago family farms! Your review directly inspires local growers.',
        type: 'success',
        confirmText: false,
        autoCloseMs: 2200,
      });
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#E2E8DF] pb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-2">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            Community Harvest Review
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
            Market Stall & Harvest Feedback
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            We value your honest review. Your feedback directly helps family farmers refine their harvesting dawn routines and rewards outstanding organic care.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">Review Successfully Recorded!</h2>
            <p className="text-xs text-[#475569] max-w-md mx-auto">
              Thank you for sharing your harvest experience! Your feedback has been forwarded to the stall master and recorded on the MarketLink public index.
            </p>
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setComment('');
                  setOrderCode('');
                  setShopperName('');
                }}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer"
              >
                Submit Another Review
              </button>
              <Link
                to="/user/history"
                className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs"
              >
                Return to My Pre-Orders
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Overall Produce & Stall Experience
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1.5 transition transform hover:scale-125 cursor-pointer focus:outline-hidden"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#16A34A] block">
                {rating === 5 && '★★★★★ Outstanding • Crisp, peak flavor & harvest at dawn'}
                {rating === 4 && '★★★★☆ Very Good • Fresh produce & cordial grower service'}
                {rating === 3 && '★★★☆☆ Average • Satisfactory stall pickup'}
                {rating <= 2 && '★★☆☆☆ Needs Improvement • Quality did not meet expectations'}
              </span>
            </div>

            {/* Quality Aspect Badges */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#0F172A]">
                Key Highlight of Your Visit
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ASPECT_OPTIONS.map((aspect) => (
                  <button
                    type="button"
                    key={aspect}
                    onClick={() => setFeedbackAspect(aspect)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      feedbackAspect === aspect
                        ? 'bg-emerald-50 text-[#16A34A] border-emerald-300 shadow-2xs'
                        : 'bg-white text-[#475569] border-[#E2E8DF] hover:bg-[#F8FAF6]'
                    }`}
                  >
                    {aspect}
                  </button>
                ))}
              </div>
            </div>

            {/* Market Selection & Order Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Chicago Farmers Market
                </label>
                <select
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                >
                  {marketsData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.neighborhood})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Pre-Order Reservation Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MLB-2026-8819"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            {/* Shopper Name */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Your Name or Initials (Optional - will be displayed publicly)
              </label>
              <input
                type="text"
                placeholder="e.g. Elena R. (Logan Square neighbor)"
                value={shopperName}
                onChange={(e) => setShopperName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Your Detailed Harvest Review <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share your experience regarding produce ripeness, aroma, packaging, farmer hospitality, or stall cleanliness..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A] leading-relaxed"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Publishing Review...' : 'Publish Community Review'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
