import React from 'react';
import { Star, MessageSquare, Loader2, AlertCircle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import FarmerReviewCard from './FarmerReviewCard';
import FarmerReviewReplyModal from './FarmerReviewReplyModal';

/**
 * FarmerReviewsTab (Phase 4.14)
 * Reviews & Feedback tab for monitoring shopper feedback, ratings,
 * and replying to customer comments.
 */
export default function FarmerReviewsTab({ hook }) {
  const {
    reviews,
    filteredReviews,
    metrics,
    loading,
    error,
    filterTab,
    setFilterTab,
    replyModalOpen,
    selectedReview,
    submittingReply,
    openReplyModal,
    closeReplyModal,
    handleSubmitReply,
    refetch,
  } = hook;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A]">Customer Reviews & Feedback</h2>
            <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {metrics.total} Total Reviews
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Monitor customer satisfaction and reply to shopper reviews on your harvest crops.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="p-2.5 rounded-xl border border-[#E2E8DF] text-slate-500 hover:text-[#16A34A] hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
          title="Refresh reviews"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Ratings Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Rating</span>
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-black text-[#0F172A]">{metrics.avgRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Reviews</span>
          <p className="text-2xl font-black text-[#0F172A]">{metrics.total}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Awaiting Reply</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-2xl font-black text-amber-600">{metrics.pendingCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Responded</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span className="text-2xl font-black text-[#16A34A]">{metrics.repliedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterTab('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            filterTab === 'ALL'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-[#F8FAF6] text-[#475569] border border-[#E2E8DF] hover:bg-slate-100'
          }`}
        >
          All Reviews ({metrics.total})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('PENDING_REPLY')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            filterTab === 'PENDING_REPLY'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-[#F8FAF6] text-[#475569] border border-[#E2E8DF] hover:bg-slate-100'
          }`}
        >
          Awaiting Response ({metrics.pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('REPLIED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            filterTab === 'REPLIED'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-[#F8FAF6] text-[#475569] border border-[#E2E8DF] hover:bg-slate-100'
          }`}
        >
          Responded ({metrics.repliedCount})
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-xs text-[#475569] font-medium">Loading shopper reviews...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="underline font-bold hover:text-rose-900 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredReviews.length === 0 && (
        <div className="text-center py-12 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAF6] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#0F172A]">No reviews in this view</h4>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            {reviews.length === 0
              ? 'No shopper reviews have been submitted for your stall yet. Once customers complete pickup orders, their ratings will appear here.'
              : 'All reviews have been answered or no reviews match your selected filter.'}
          </p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <FarmerReviewCard
              key={review.id}
              review={review}
              onOpenReply={openReplyModal}
            />
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <FarmerReviewReplyModal
        isOpen={replyModalOpen}
        onClose={closeReplyModal}
        onSubmit={handleSubmitReply}
        review={selectedReview}
        submitting={submittingReply}
      />
    </div>
  );
}
