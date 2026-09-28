import { useState, useEffect, useCallback, useMemo } from 'react';
import { reviewApi } from '../api/reviewApi';
import { useModal } from '../context/ModalContext';

/**
 * useFarmerReviews (Phase 4.14)
 * Custom hook for farmer feedback monitoring and replying to shopper reviews.
 */
export function useFarmerReviews(farmerId, products = []) {
  const { showAlert } = useModal();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter: 'ALL', 'PENDING_REPLY', 'REPLIED'
  const [filterTab, setFilterTab] = useState('ALL');

  // Modal State for replying
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchAllReviews = useCallback(async () => {
    if (!farmerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch stall reviews
      const stallPromise = reviewApi.getFarmerReviews(farmerId).catch(() => ({ data: [] }));

      // 2. Fetch reviews for each product owned by farmer
      const productPromises = (products || []).slice(0, 15).map((p) =>
        reviewApi.getProductReviews(p.id).catch(() => ({ data: [] }))
      );

      const [stallRes, ...productResponses] = await Promise.all([stallPromise, ...productPromises]);

      const stallList = Array.isArray(stallRes?.data) ? stallRes.data : [];
      const productLists = productResponses.flatMap((res) => (Array.isArray(res?.data) ? res.data : []));

      // Deduplicate by review ID
      const reviewMap = new Map();
      [...stallList, ...productLists].forEach((rev) => {
        if (rev?.id && !reviewMap.has(rev.id)) {
          reviewMap.set(rev.id, rev);
        }
      });

      const combined = Array.from(reviewMap.values()).sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );

      setReviews(combined);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not load customer reviews.');
    } finally {
      setLoading(false);
    }
  }, [farmerId, products]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { total: 0, avgRating: 5.0, repliedCount: 0, pendingCount: 0 };

    const sumRating = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const avgRating = (sumRating / total).toFixed(1);
    const repliedCount = reviews.filter((r) => Boolean(r.farmer_reply)).length;
    const pendingCount = reviews.filter((r) => !r.farmer_reply && Boolean(r.product_id)).length;

    return { total, avgRating, repliedCount, pendingCount };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterTab === 'REPLIED') return Boolean(r.farmer_reply);
      if (filterTab === 'PENDING_REPLY') return !r.farmer_reply && Boolean(r.product_id);
      return true;
    });
  }, [reviews, filterTab]);

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setSelectedReview(null);
  };

  const handleSubmitReply = async (replyText) => {
    if (!selectedReview?.id) return;
    setSubmittingReply(true);
    try {
      const res = await reviewApi.replyReview(selectedReview.id, replyText);
      const updated = res?.data || res;

      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReview.id
            ? { ...r, farmer_reply: replyText, farmer_replied_at: new Date().toISOString() }
            : r
        )
      );

      showAlert({
        title: 'Response Sent',
        message: 'Your reply has been posted and the customer was notified.',
        type: 'success',
        autoCloseMs: 2000,
      });

      closeReplyModal();
    } catch (err) {
      showAlert({
        title: 'Reply Failed',
        message: err?.response?.data?.message || 'Could not submit review response.',
        type: 'danger',
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  return {
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
    refetch: fetchAllReviews,
  };
}
