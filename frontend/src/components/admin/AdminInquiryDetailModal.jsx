import React from 'react';
import { X, Mail, CheckCircle2, User, Calendar } from 'lucide-react';

/**
 * AdminInquiryDetailModal (Phase 4.16)
 * Modal for reading full visitor inquiries and marking them resolved.
 */
export default function AdminInquiryDetailModal({ isOpen, onClose, inquiry, onMarkResolved, loading = false }) {
  if (!isOpen || !inquiry) return null;

  const handleResolve = async () => {
    await onMarkResolved(inquiry.id);
    onClose();
  };

  const isResolved = Boolean(inquiry.is_read || inquiry.status === 'RESOLVED');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E2E8DF] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0F172A]">Visitor Inquiry</h2>
              <p className="text-xs text-[#475569]">Contact message inquiry details</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender Info Card */}
        <div className="p-4 bg-[#F8FAF6] rounded-2xl border border-[#E2E8DF] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[#0F172A]">
              <User className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>{inquiry.name || inquiry.sender || 'Anonymous'}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {isResolved ? 'RESOLVED' : 'UNREAD / NEW'}
            </span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">{inquiry.email}</div>
          {inquiry.created_at && (
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pt-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(inquiry.created_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#0F172A]">{inquiry.subject || 'No Subject'}</div>
          <div className="p-4 rounded-2xl bg-white border border-[#E2E8DF] text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {inquiry.message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8DF]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E2E8DF] text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
          {!isResolved && (
            <button
              type="button"
              disabled={loading}
              onClick={handleResolve}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Marking...' : 'Mark as Handled'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
