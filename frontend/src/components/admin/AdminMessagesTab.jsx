import React, { useState } from 'react';
import { Mail, Search, CheckCircle2, Eye } from 'lucide-react';
import AdminInquiryDetailModal from './AdminInquiryDetailModal';

/**
 * AdminMessagesTab (Phase 4.16)
 * Real-time visitor contact inquiries inbox with filter and resolution tracking.
 */
export default function AdminMessagesTab({ inquiryHook }) {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    inquiries,
    totalCount,
    unreadCount,
    loading,
    actionLoading,
    filterRead,
    setFilterRead,
    searchQuery,
    setSearchQuery,
    markAsRead,
  } = inquiryHook;

  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailOpen(true);
  };

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A]">Visitor & Patron Inquiries Inbox</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {unreadCount} Unresolved
              </span>
            )}
          </div>
          <p className="text-xs text-[#475569]">
            Direct contact requests, vendor stall inquiries, and community partnership messages.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, or subject..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-[#F8FAF6] border border-[#E2E8DF] text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterRead('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterRead === 'all' ? 'bg-[#16A34A] text-white shadow-2xs' : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterRead('unread')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterRead === 'unread' ? 'bg-[#16A34A] text-white shadow-2xs' : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterRead('read')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterRead === 'read' ? 'bg-[#16A34A] text-white shadow-2xs' : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No contact inquiries found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
              <tr>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject & Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8DF]">
              {inquiries.map((msg) => {
                const isResolved = Boolean(msg.is_read || msg.status === 'RESOLVED');
                return (
                  <tr key={msg.id} className="hover:bg-[#F8FAF6]/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>{msg.name || msg.sender}</span>
                      </div>
                      <div className="text-[11px] text-[#475569] pl-5 font-mono">{msg.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-[#0F172A]">{msg.subject || 'No Subject'}</div>
                      <p className="text-[11px] text-[#475569] line-clamp-1">{msg.message}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {isResolved ? 'RESOLVED' : 'NEW'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(msg)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        {!isResolved && (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => markAsRead(msg.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AdminInquiryDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        inquiry={selectedInquiry}
        onMarkResolved={markAsRead}
        loading={actionLoading}
      />
    </div>
  );
}
