import React, { useState, useEffect } from 'react';
import { Megaphone, X } from 'lucide-react';
import { notificationApi } from '../../api';

/**
 * AnnouncementBanner Component
 * Fetches active platform announcements via GET /api/v1/announcements/active.
 * Displays a dismissible top banner styled with Harvest Gold & Botanical Green accents.
 */
export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('marketlink_dismissed_announcements') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const response = await notificationApi.getActiveAnnouncements();
        if (isMounted && response?.data) {
          const list = Array.isArray(response.data)
            ? response.data
            : response.data.data || [];
          setAnnouncements(list);
        }
      } catch {
        // Gracefully ignore error for unauthenticated/inactive public announcements
      }
    };

    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = (id) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      sessionStorage.setItem('marketlink_dismissed_announcements', JSON.stringify(updated));
    } catch {
      // Storage unavailable guard
    }
  };

  const visibleAnnouncements = announcements.filter(
    (item) => !dismissedIds.includes(item.id)
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  const current = visibleAnnouncements[0];

  return (
    <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-green-800 text-white px-4 py-2.5 shadow-xs relative z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <Megaphone className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-black/25 shrink-0">
            {current.target_role === 'farmer'
              ? 'Farmer Notice'
              : current.target_role === 'customer'
              ? 'Shopper Notice'
              : 'Market Bulletin'}
          </span>
          <span className="font-bold shrink-0">{current.title}:</span>
          <span className="truncate text-emerald-100">{current.content}</span>
        </div>

        <button
          onClick={() => handleDismiss(current.id)}
          className="p-1 rounded-md hover:bg-white/20 text-white/90 hover:text-white transition shrink-0 cursor-pointer"
          title="Dismiss notice"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
