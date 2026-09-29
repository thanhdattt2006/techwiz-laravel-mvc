import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, Send, CheckCircle2, Store, Sprout, Loader2, LogIn, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import orderApi from '../../api/orderApi';
import reviewApi from '../../api/reviewApi';

const RATING_LABELS = {
  5: '★★★★★ Outstanding • Crisp, peak flavor & harvest at dawn',
  4: '★★★★☆ Very Good • Fresh produce & cordial grower service',
  3: '★★★☆☆ Average • Satisfactory stall pickup',
  2: '★★☆☆☆ Needs Improvement • Quality did not meet expectations',
  1: '★☆☆☆☆ Poor • Did not meet expectations',
};

/**
 * FeedbackPage (Phase 4.12)
 * Verified Community Harvest Review portal with multi-item order review support.
 * Enforces customer authentication, completed order prerequisite, and duplicate handling.
 */
export default function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId') || '';
  const { user, isLoading: authLoading } = useAuth();
  const { showAlert } = useModal();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [targetType, setTargetType] = useState('farmer');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) { setLoadingOrders(false); return; }
    let isMounted = true;
    orderApi.getMyOrders({ status: 'completed' })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setOrders(list);
        if (list.length > 0) {
          const match = requestId ? list.find((o) => o.order_code === requestId || String(o.id) === requestId) : null;
          const chosen = match || list[0];
          setSelectedOrderId(String(chosen.id));
          if (chosen.items?.length > 0) setSelectedProductId(String(chosen.items[0].product_id || chosen.items[0].id));
        }
      })
      .catch(() => { if (isMounted) setOrders([]); })
      .finally(() => { if (isMounted) setLoadingOrders(false); });
    return () => { isMounted = false; };
  }, [user, requestId]);

  const selectedOrder = orders.find((o) => String(o.id) === String(selectedOrderId));
  const items = Array.isArray(selectedOrder?.items) ? selectedOrder.items : [];

  const handleOrderChange = (id) => {
    setSelectedOrderId(id);
    const ord = orders.find((o) => String(o.id) === String(id));
    if (ord?.items?.length > 0) setSelectedProductId(String(ord.items[0].product_id || ord.items[0].id));
  };

  const handleReviewNextItem = () => {
    setSubmitted(false);
    setComment('');
    setRating(5);
    setTargetType('product');
    const currentIndex = items.findIndex((it) => String(it.product_id || it.id) === String(selectedProductId));
    const nextItem = items[(currentIndex + 1) % items.length];
    if (nextItem) setSelectedProductId(String(nextItem.product_id || nextItem.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) {
      showAlert({ title: 'Order Required', message: 'Please select a completed order to review.', type: 'warning' });
      return;
    }
    const payload = {
      order_id: selectedOrder.id,
      rating,
      comment: comment.trim() || null,
      farmer_id: targetType === 'farmer' ? (selectedOrder.farmer_id || selectedOrder.farmer?.id) : null,
      product_id: targetType === 'product' ? Number(selectedProductId) : null,
    };
    setSubmitting(true);
    try {
      await reviewApi.submitReview(payload);
      setSubmitted(true);
      showAlert({ title: 'Review Published', message: 'Thank you for supporting Chicago family farms! Your review directly inspires local growers.', type: 'success' });
    } catch (err) {
      const isDuplicate = err?.response?.status === 422 &&
        JSON.stringify(err?.response?.data || '').toLowerCase().includes('already submitted');
      if (isDuplicate) {
        showAlert({
          title: 'Already Reviewed',
          message: `You have already submitted a review for this ${targetType === 'farmer' ? 'farmer stall' : 'produce item'} in order #${selectedOrder.order_code}. Please select another item in the order to review!`,
          type: 'warning',
        });
      } else {
        const msg = err?.response?.data?.message || err?.response?.data?.errors?.order_id?.[0] || 'Unable to submit review.';
        showAlert({ title: 'Submission Failed', message: msg, type: 'danger' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2 border-b border-[#E2E8DF] pb-6">
          <Link to="/" className="inline-block group mb-1">
            <img src="/logo.png" alt="MarketLink" className="w-14 h-14 mx-auto object-contain group-hover:scale-105 transition" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Harvest Review
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Stall & Produce Feedback</h1>
          <p className="text-xs sm:text-sm text-[#475569]">Reviews are tied to completed pre-orders to ensure authentic community ratings.</p>
        </div>

        {authLoading || loadingOrders ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#16A34A] mx-auto" />
            <p className="text-xs font-bold text-[#475569]">Verifying order eligibility...</p>
          </div>
        ) : !user ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto"><LogIn className="w-7 h-7" /></div>
            <h2 className="text-lg font-bold text-[#0F172A]">Sign In Required</h2>
            <p className="text-xs text-[#475569] max-w-md mx-auto">Only verified customers who have completed a harvest pickup at a Chicago farmers market can submit reviews.</p>
            <div className="pt-2">
              <Link to="/login?redirect=/feedback" className="px-6 py-3 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs inline-flex items-center gap-2">
                <LogIn className="w-4 h-4" /> <span>Sign In to Leave Review</span>
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#475569] flex items-center justify-center mx-auto"><ShoppingBag className="w-7 h-7" /></div>
            <h2 className="text-lg font-bold text-[#0F172A]">No Completed Pre-Orders</h2>
            <p className="text-xs text-[#475569] max-w-md mx-auto">You do not have any completed pre-orders eligible for review yet. Please pick up your harvest crate at the stall first!</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link to="/user/history" className="px-5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition">View Pre-Orders</Link>
              <Link to="/products" className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs">Browse Fresh Produce</Link>
            </div>
          </div>
        ) : submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto"><CheckCircle2 className="w-10 h-10" /></div>
            <h2 className="text-xl font-bold text-[#0F172A]">Review Published Successfully!</h2>
            <p className="text-xs text-[#475569] max-w-md mx-auto">Thank you for sharing your harvest feedback! Your rating directly inspires local growers and has been recorded on the public stall profile.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {items.length > 1 && (
                <button type="button" onClick={handleReviewNextItem} className="px-5 py-2.5 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition shadow-2xs inline-flex items-center gap-1.5 cursor-pointer">
                  <span>Review Another Item in Order #{selectedOrder?.order_code}</span> <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <Link to="/user/history" className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs">Return to My Pre-Orders</Link>
              <Link to="/products" className="px-5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition">Browse Fresh Produce</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">Select Completed Pre-Order</label>
              <select value={selectedOrderId} onChange={(e) => handleOrderChange(e.target.value)} className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]">
                {orders.map((o) => (<option key={o.id} value={o.id}>#{o.order_code} • {o.farmer?.stall_name || 'Stall'} ({o.pickup_date})</option>))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">Review Target</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setTargetType('farmer')} className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${targetType === 'farmer' ? 'bg-emerald-50 text-[#16A34A] border-emerald-300 shadow-2xs' : 'bg-white text-[#475569] border-[#E2E8DF] hover:bg-[#F8FAF6]'}`}>
                  <Store className="w-4 h-4" /> <span className="truncate">Farmer Stall</span>
                </button>
                <button type="button" onClick={() => setTargetType('product')} disabled={items.length === 0} className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition cursor-pointer disabled:opacity-50 ${targetType === 'product' ? 'bg-emerald-50 text-[#16A34A] border-emerald-300 shadow-2xs' : 'bg-white text-[#475569] border-[#E2E8DF] hover:bg-[#F8FAF6]'}`}>
                  <Sprout className="w-4 h-4" /> <span className="truncate">Produce Item</span>
                </button>
              </div>
            </div>

            {targetType === 'product' && items.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F172A]">Select Produce Item in Order</label>
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]" required>
                  {items.map((it) => (<option key={it.id || it.product_id} value={it.product_id || it.id}>{it.product_name || it.name} ({it.quantity} {it.unit})</option>))}
                </select>
              </div>
            )}

            <div className="text-center space-y-2 py-3 bg-[#F8FAF6] rounded-2xl border border-[#E2E8DF]">
              <span className="text-xs font-bold text-[#475569] block">Your Overall Rating</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)} className="p-1 transition transform hover:scale-125 cursor-pointer focus:outline-hidden">
                    <Star className={`w-8 h-8 ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#16A34A] block">{RATING_LABELS[rating]}</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F172A]">Detailed Harvest Feedback (Optional)</label>
              <textarea rows={4} maxLength={2000} placeholder="Share your experience regarding produce ripeness, aroma, packaging, farmer hospitality, or stall cleanliness..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A] leading-relaxed" />
            </div>

            <button type="submit" disabled={submitting} className="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{submitting ? 'Publishing Review...' : 'Publish Verified Harvest Review'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
