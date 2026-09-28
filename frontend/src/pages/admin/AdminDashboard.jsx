import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';
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
  AdminCategoriesTab,
  AdminReviewsModerationTab,
  AdminAnnouncementsTab,
  AdminMessagesTab,
} from '../../components/admin';

const VALID_TABS = [
  'overview',
  'markets',
  'categories',
  'vendors',
  'moderation',
  'reviews',
  'users',
  'notices',
  'messages',
  'reports',
];

/**
 * AdminDashboard (Phase 4.18)
 * Central Administration Portal driven by the Left Sidebar.
 */
export default function AdminDashboard() {
  const [searchParams] = useSearchParams();

  const urlTab = searchParams.get('tab');
  const normalizedTab = urlTab ? urlTab.toLowerCase() : 'overview';
  const activeTab = VALID_TABS.includes(normalizedTab)
    ? (normalizedTab === 'reports' ? 'OVERVIEW' : normalizedTab === 'reviews' ? 'MODERATION' : normalizedTab.toUpperCase())
    : 'OVERVIEW';

  // Phase 4.15 & 4.16 Live REST API Hooks
  const adminOverview = useAdminOverview();
  const adminFarmers = useAdminFarmers();
  const adminUsers = useAdminUsers();
  const adminMarkets = useAdminMarkets();
  const adminCategories = useAdminCategories();
  const adminModeration = useAdminModeration();
  const adminAnnouncements = useAdminAnnouncements();
  const adminInquiries = useAdminInquiries();

  const handleRefresh = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        adminOverview.refetch?.();
        break;
      case 'MARKETS':
        adminMarkets.refetch?.();
        break;
      case 'CATEGORIES':
        adminCategories.refetch?.();
        break;
      case 'VENDORS':
        adminFarmers.refetch?.();
        break;
      case 'MODERATION':
        adminModeration.refetch?.();
        break;
      case 'USERS':
        adminUsers.refetch?.();
        break;
      case 'NOTICES':
        adminAnnouncements.refetch?.();
        break;
      case 'MESSAGES':
        adminInquiries.refetch?.();
        break;
      default:
        window.location.reload();
    }
  };

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

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] hover:bg-white text-xs font-bold text-[#475569] hover:text-[#0F172A] shadow-2xs hover:shadow-xs transition cursor-pointer self-start md:self-center"
          title="Refresh active tab data"
        >
          <RefreshCw className="w-4 h-4 text-[#16A34A]" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Tab Contents */}
      {activeTab === 'OVERVIEW' && (
        <AdminOverviewTab hook={adminOverview} />
      )}

      {activeTab === 'MARKETS' && (
        <AdminMarketsTab marketHook={adminMarkets} categoryHook={adminCategories} />
      )}

      {activeTab === 'CATEGORIES' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <AdminCategoriesTab categoryHook={adminCategories} />
        </div>
      )}

      {activeTab === 'VENDORS' && (
        <AdminFarmersApprovalTab hook={adminFarmers} />
      )}

      {activeTab === 'MODERATION' && (
        <AdminReviewsModerationTab moderationHook={adminModeration} />
      )}

      {activeTab === 'USERS' && (
        <AdminUsersTab hook={adminUsers} />
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
