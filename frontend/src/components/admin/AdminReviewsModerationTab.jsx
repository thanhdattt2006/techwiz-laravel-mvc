import React from 'react';
import { Star, ShieldCheck, Eye, EyeOff } from 'lucide-react';

/**
 * AdminReviewsModerationTab
 * Reviews moderation and content oversight (Pre-Phase 4.16 modularization).
 */
export default function AdminReviewsModerationTab({ reviewsList = [], onToggleHideReview }) {
  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Customer Feedback Moderation</h2>
          <p className="text-xs text-[#475569]">
            Review public customer feedback, star ratings, and handle reported spam or policy violations.
          </p>
        </div>
        <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {reviewsList.length} Moderated Reviews
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
            <tr>
              <th className="py-3 px-4">Author & Venue</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Comment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8DF]">
            {reviewsList.map((rev) => {
              const isHidden = rev.status === 'HIDDEN' || rev.is_hidden;

              return (
                <tr key={rev.id} className="hover:bg-[#F8FAF6]/60 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#0F172A]">{rev.author || rev.customer?.fullname || 'Shopper'}</div>
                    <div className="text-[11px] text-[#475569]">{rev.farmer || rev.market || 'Farmer Stall'}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-bold text-[#0F172A]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-sm text-[#475569]">
                    <p className="line-clamp-2 italic">"{rev.comment}"</p>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        isHidden
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                      }`}
                    >
                      {isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onToggleHideReview(rev.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs ${
                        isHidden
                          ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isHidden ? 'Publish' : 'Hide'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
