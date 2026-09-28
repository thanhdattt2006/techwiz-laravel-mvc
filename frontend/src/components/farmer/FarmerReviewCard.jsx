import React from 'react';
import { Star, MessageSquare, Sprout, CornerDownRight, Edit3 } from 'lucide-react';

/**
 * FarmerReviewCard (Phase 4.14)
 * Displays customer review on produce item or stall with farmer reply thread.
 */
export default function FarmerReviewCard({ review, onOpenReply }) {
  const customer = review.customer || {};
  const product = review.product || null;
  const rating = Number(review.rating || 5);
  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  const isProductReview = Boolean(review.product_id);
  const hasReply = Boolean(review.farmer_reply);

  return (
    <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-5 space-y-4 hover:border-emerald-300 transition shadow-2xs">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#E2E8DF]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#0F172A]">{customer.fullname || 'Verified Shopper'}</span>
          <span className="text-[11px] text-slate-400">• {formattedDate}</span>
        </div>

        {/* Target Badge */}
        <div>
          {isProductReview ? (
            <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Crop: {product?.name || 'Produce'}
            </span>
          ) : (
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Stall Experience
            </span>
          )}
        </div>
      </div>

      {/* Customer Comment */}
      <p className="text-xs text-[#0F172A] leading-relaxed">
        {review.comment || 'No written feedback provided.'}
      </p>

      {/* Farmer Reply Box (if replied) */}
      {hasReply && (
        <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5 ml-2 sm:ml-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5 text-[#16A34A]" />
              <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Your Stall Response</span>
            </span>
            {review.farmer_replied_at && (
              <span className="text-[10px] text-slate-400">
                {new Date(review.farmer_replied_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
          <p className="text-xs text-[#475569] italic pl-5">
            "{review.farmer_reply}"
          </p>
        </div>
      )}

      {/* Action Footer */}
      {isProductReview && (
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={() => onOpenReply(review)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-white text-xs font-bold text-[#475569] hover:text-[#16A34A] hover:border-emerald-300 transition cursor-pointer shadow-2xs"
          >
            {hasReply ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Response</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Reply to Shopper</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
