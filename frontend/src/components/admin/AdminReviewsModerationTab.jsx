import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, MessageSquare, Package, Star } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

/**
 * AdminReviewsModerationTab (Phase 4.16)
 * Platform moderation tab for Customer Reviews & Produce Catalog items.
 */
export default function AdminReviewsModerationTab({ moderationHook }) {
  const { showAlert } = useModal();
  const [activeSection, setActiveSection] = useState('REVIEWS'); // 'REVIEWS' | 'PRODUCTS'

  const {
    products,
    reviews,
    loadingProducts,
    loadingReviews,
    actionLoading,
    toggleHideProduct,
    toggleHideReview,
  } = moderationHook;

  const handleToggleReview = async (review) => {
    const res = await toggleHideReview(review.id);
    if (!res.success) {
      showAlert({ title: 'Error', message: res.error, type: 'danger' });
    }
  };

  const handleToggleProduct = async (product) => {
    const res = await toggleHideProduct(product.id);
    if (!res.success) {
      showAlert({ title: 'Error', message: res.error, type: 'danger' });
    }
  };

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('REVIEWS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSection === 'REVIEWS' ? 'bg-[#16A34A] text-white shadow-xs' : 'bg-slate-100 text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reviews Moderation ({reviews.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('PRODUCTS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSection === 'PRODUCTS' ? 'bg-[#16A34A] text-white shadow-xs' : 'bg-slate-100 text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Produce Moderation ({products.length})</span>
            </button>
          </div>
          <p className="text-xs text-[#475569]">
            {activeSection === 'REVIEWS'
              ? 'Audit user feedback ratings. Hide abusive content or unhide legitimate remarks.'
              : 'Audit agricultural listings. Hide non-compliant produce from public catalog.'}
          </p>
        </div>
      </div>

      {/* Reviews Table */}
      {activeSection === 'REVIEWS' && (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
          {loadingReviews ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No customer reviews to audit.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
                <tr>
                  <th className="py-3 px-4">Author & Target</th>
                  <th className="py-3 px-4">Rating & Review</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8DF]">
                {reviews.map((r) => {
                  const isHidden = Boolean(r.is_hidden);
                  return (
                    <tr key={r.id} className="hover:bg-[#F8FAF6]/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0F172A]">{r.customer?.fullname || r.author || 'Anonymous'}</div>
                        <div className="text-[11px] text-[#475569]">
                          {r.product?.name ? `Product: ${r.product.name}` : r.farmer?.stall_name ? `Stall: ${r.farmer.stall_name}` : 'General Feedback'}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-center gap-1 mb-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold text-xs">{r.rating} / 5</span>
                        </div>
                        <p className="text-slate-600 line-clamp-2 text-xs">{r.comment || 'No comment text'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isHidden ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isHidden ? 'HIDDEN' : 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleToggleReview(r)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isHidden
                              ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{isHidden ? 'Unhide' : 'Hide'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Produce Products Table */}
      {activeSection === 'PRODUCTS' && (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
          {loadingProducts ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading catalog items...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No produce items found.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
                <tr>
                  <th className="py-3 px-4">Produce Item</th>
                  <th className="py-3 px-4">Farmer Stall</th>
                  <th className="py-3 px-4">Price & Unit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8DF]">
                {products.map((p) => {
                  const isHidden = Boolean(p.is_hidden);
                  return (
                    <tr key={p.id} className="hover:bg-[#F8FAF6]/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0F172A]">{p.name}</div>
                        <div className="text-[11px] text-[#475569]">{p.category?.name || 'Produce'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0F172A]">{p.farmer?.stall_name || 'Grower Stall'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-[#16A34A]">${Number(p.price).toFixed(2)}</span>
                        <span className="text-slate-400 text-[11px]"> / {p.unit || 'unit'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isHidden ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isHidden ? 'HIDDEN' : 'PUBLIC'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleToggleProduct(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isHidden
                              ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{isHidden ? 'Unhide' : 'Hide'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
