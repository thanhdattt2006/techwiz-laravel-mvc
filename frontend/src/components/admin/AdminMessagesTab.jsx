import React from 'react';
import { Mail, Check, CheckCircle2, Clock } from 'lucide-react';

/**
 * AdminMessagesTab
 * Inquiries inbox and customer contact messages (Pre-Phase 4.16 modularization).
 */
export default function AdminMessagesTab({ inquiries = [], onMarkResolved }) {
  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Public Inquiries & Support Inbox</h2>
          <p className="text-xs text-[#475569]">
            Review contact form messages, vendor partnership requests, and shopper inquiries.
          </p>
        </div>
        <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {inquiries.length} Messages
        </span>
      </div>

      <div className="space-y-3">
        {inquiries.map((msg) => {
          const isResolved = msg.status === 'RESOLVED' || msg.is_read;

          return (
            <div
              key={msg.id}
              className={`p-4.5 rounded-2xl border transition space-y-2.5 ${
                isResolved
                  ? 'bg-[#F8FAF6] border-[#E2E8DF] opacity-80'
                  : 'bg-white border-emerald-200 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      isResolved ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-[#16A34A]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{msg.sender}</h4>
                    <p className="text-[10px] text-slate-400">{msg.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{msg.date || 'Recent'}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      isResolved
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isResolved ? 'Resolved' : 'New'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#0F172A] block">{msg.subject}</span>
                <p className="text-[#475569] leading-relaxed">{msg.message}</p>
              </div>

              {!isResolved && onMarkResolved && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => onMarkResolved(msg.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Handled</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
