import React from 'react';
import { Star, MessageSquare, CornerDownRight, Sprout } from 'lucide-react';

/**
 * ProductReviewsList
 * Displays verified customer ratings and farmer responses for a produce item.
 */
export default function ProductReviewsList({ reviews = [], avgRating = 0, reviewCount = 0 }) {
  const formattedAvg = Number(avgRating).toFixed(1);

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Reviews Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#16A34A]" />
            <span>Customer Reviews & Feedback</span>
          </h2>
          <p className="text-xs text-[#475569]">
            Direct feedback from shoppers who collected this produce at weekend markets.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/70 px-3 py-1.5 rounded-xl">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-black text-amber-800">{formattedAvg}</span>
          <span className="text-xs text-[#475569]">({reviewCount})</span>
        </div>
      </div>

      {/* Reviews Content */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 space-y-3 bg-[#F8FAF6] rounded-2xl border border-dashed border-[#E2E8DF]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 text-[#16A34A] flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">No Reviews Yet</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Be the first local shopper to reserve this harvest and share your thoughts after market pickup!
          </p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-slate-100">
          {reviews.map((rev) => {
            const customerName = rev.customer?.fullname || rev.customer_name || 'Verified Shopper';
            const ratingScore = rev.rating || 5;
            const reviewDate = rev.created_at
              ? new Date(rev.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent Harvest';

            return (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#15803D] font-black text-xs flex items-center justify-center">
                      {customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0F172A] block leading-snug">
                        {customerName}
                      </strong>
                      <span className="text-[11px] text-[#475569]">{reviewDate}</span>
                    </div>
                  </div>

                  {/* Stars Rating */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= ratingScore
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-[#0F172A] leading-relaxed bg-[#F8FAF6] p-3 rounded-xl border border-slate-100">
                  {rev.comment}
                </p>

                {/* Farmer Reply Box */}
                {rev.farmer_reply && (
                  <div className="ml-4 pl-3 border-l-2 border-[#16A34A] pt-1">
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#15803D]">
                        <CornerDownRight className="w-3.5 h-3.5 text-[#16A34A]" />
                        <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>Response from Stall Master</span>
                      </div>
                      <p className="text-xs text-[#0F172A] leading-relaxed pl-5">
                        {rev.farmer_reply}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
