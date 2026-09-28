import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  TrendingUp,
  Store,
  Users,
  ShieldCheck,
  MessageSquare,
  MapPin,
  Bell,
} from 'lucide-react';
import { useAdminOverview } from '../../hooks/useAdminOverview';
import { useAdminFarmers } from '../../hooks/useAdminFarmers';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { useAdminMarkets } from '../../hooks/useAdminMarkets';
import { useAdminCategories } from '../../hooks/useAdminCategories';
import { useAdminModeration } from '../../hooks/useAdminModeration';
import { useAdminAnnouncements } from '../../hooks/useAdminAnnouncements';
import { useAdminInquiries } from '../../hooks/useAdminInquiries';
import {
  AdminOverviewTab,
  AdminFarmersApprovalTab,
  AdminUsersTab,
  AdminMarketsTab,
  AdminReviewsModerationTab,
  AdminAnnouncementsTab,
  AdminMessagesTab,
} from '../../components/admin';

const VALID_TABS = ['overview', 'vendors', 'users', 'markets', 'moderation', 'reviews', 'notices', 'messages', 'reports'];

/**
 * AdminDashboard (Phase 4.16)
 * Central Administration Portal connecting 100% live REST API hooks.
 */
export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = searchParams.get('tab');
  const normalizedTab = urlTab ? urlTab.toLowerCase() : 'overview';
  const activeTab = VALID_TABS.includes(normalizedTab)
    ? (normalizedTab === 'reports' ? 'OVERVIEW' : normalizedTab === 'reviews' ? 'MODERATION' : normalizedTab.toUpperCase())
    : 'OVERVIEW';

  const setActiveTab = (tab) => {
    setSearchParams({ tab: tab.toLowerCase() });
  };

  // Phase 4.15 & 4.16 Live REST API Hooks
  const adminOverview = useAdminOverview();
  const adminFarmers = useAdminFarmers();
  const adminUsers = useAdminUsers();
  const adminMarkets = useAdminMarkets();
  const adminCategories = useAdminCategories();
  const adminModeration = useAdminModeration();
  const adminAnnouncements = useAdminAnnouncements();
  const adminInquiries = useAdminInquiries();

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Admin Header */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MarketLink Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Admin Governance & Control
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Oversee farmers market venues, audit user conduct, and approve local grower stall applications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] self-start md:self-center overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'OVERVIEW' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('VENDORS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'VENDORS' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Farmers ({adminFarmers.pendingFarmers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'USERS' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users ({adminUsers.users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MARKETS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'MARKETS' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Markets & Categories</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MODERATION')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'MODERATION' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Moderation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('NOTICES')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'NOTICES' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Bulletins</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MESSAGES')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'MESSAGES' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inbox ({adminInquiries.unreadCount})</span>
          </button>
        </div>
      </div>

      {/* 2. Tab Contents */}
      {activeTab === 'OVERVIEW' && (
        <AdminOverviewTab hook={adminOverview} />
      )}

      {activeTab === 'VENDORS' && (
        <AdminFarmersApprovalTab hook={adminFarmers} />
      )}

      {activeTab === 'USERS' && (
        <AdminUsersTab hook={adminUsers} />
      )}

      {activeTab === 'MARKETS' && (
        <AdminMarketsTab marketHook={adminMarkets} categoryHook={adminCategories} />
      )}

      {activeTab === 'MODERATION' && (
        <AdminReviewsModerationTab moderationHook={adminModeration} />
      )}

      {activeTab === 'NOTICES' && (
        <AdminAnnouncementsTab announcementHook={adminAnnouncements} />
      )}

      {activeTab === 'MESSAGES' && (
        <AdminMessagesTab inquiryHook={adminInquiries} />
      )}
    </div>
  );
}
