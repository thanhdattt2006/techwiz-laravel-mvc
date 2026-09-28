import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  Store,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'order_placed':
    case 'order_accepted':
      return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
    case 'order_ready':
      return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
    case 'order_completed':
      return <CheckCheck className="w-4 h-4 text-emerald-600" />;
    case 'order_declined':
    case 'farmer_rejected':
      return <XCircle className="w-4 h-4 text-rose-600" />;
    case 'farmer_approved':
      return <Store className="w-4 h-4 text-purple-600" />;
    case 'review_reply':
      return <MessageSquare className="w-4 h-4 text-amber-600" />;
    default:
      return <Info className="w-4 h-4 text-[#16A34A]" />;
  }
};

/**
 * NotificationDropdown (Phase 4.17)
 * In-app notifications menu displaying alerts for orders, approvals, and reviews.
 */
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    loading,
    actionLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-[#16A34A] border border-[#E2E8DF] transition cursor-pointer"
        title="View Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-[#E2E8DF] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-[#E2E8DF] flex items-center justify-between bg-[#F8FAF6]">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-[#0F172A]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-[#16A34A] hover:underline cursor-pointer disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8DF]">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCheck className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#0F172A]">All caught up!</p>
                <p className="text-[11px] text-slate-500">No new notices at this time.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isRead = Boolean(n.is_read);
                return (
                  <div
                    key={n.id}
                    onClick={() => !isRead && markAsRead(n.id)}
                    className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-slate-50 ${
                      !isRead ? 'bg-emerald-50/40' : 'bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs truncate ${!isRead ? 'font-bold text-[#0F172A]' : 'font-medium text-slate-700'}`}>
                          {n.title}
                        </p>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      {n.created_at && (
                        <p className="text-[10px] text-slate-400 font-mono pt-0.5">
                          {new Date(n.created_at).toLocaleDateString()} • {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
