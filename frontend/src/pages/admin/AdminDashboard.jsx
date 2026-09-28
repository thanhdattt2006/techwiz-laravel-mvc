import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  TrendingUp,
  Store,
  Users,
  ShieldCheck,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useAdminOverview } from '../../hooks/useAdminOverview';
import { useAdminFarmers } from '../../hooks/useAdminFarmers';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import {
  AdminOverviewTab,
  AdminFarmersApprovalTab,
  AdminUsersTab,
  AdminMarketsTab,
  AdminReviewsModerationTab,
  AdminMessagesTab,
} from '../../components/admin';
import marketsData from '../../data/markets.json';
import { INITIAL_REVIEWS, INITIAL_INQUIRIES } from '../../components/admin/adminPlaceholders';

const VALID_TABS = ['overview', 'vendors', 'users', 'markets', 'reviews', 'messages', 'reports'];

/**
 * AdminDashboard (Phase 4.15)
 * Coordinator page for Platform Administration & Governance.
 * Tabs: Overview KPIs, Farmer Approvals, Users Governance, Markets, Reviews, and Inquiries.
 */
export default function AdminDashboard() {
  const { showAlert, showConfirm } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = searchParams.get('tab');
  const activeTab = urlTab && VALID_TABS.includes(urlTab.toLowerCase())
    ? (urlTab.toLowerCase() === 'reports' ? 'OVERVIEW' : urlTab.toUpperCase())
    : 'OVERVIEW';

  const setActiveTab = (tab) => {
    setSearchParams({ tab: tab.toLowerCase() });
  };

  // Phase 4.15 Live State Hooks
  const adminOverview = useAdminOverview();
  const adminFarmers = useAdminFarmers();
  const adminUsers = useAdminUsers();

  // Local state for Phase 4.16 tabs until next phase API hookup
  const [marketsList, setMarketsList] = useState(marketsData);
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);

  const pendingFarmersCount = adminFarmers.pendingFarmers.length;
  const usersCount = adminUsers.users.length;

  const handleDeleteMarket = async (marketId, marketName) => {
    const confirmed = await showConfirm({
      title: 'Deactivate Farmers Market?',
      message: `Are you sure you want to deactivate "${marketName}"?`,
      confirmText: 'Deactivate',
      type: 'danger',
    });
    if (confirmed) {
      setMarketsList((prev) => prev.filter((m) => m.id !== marketId));
    }
  };

  const handleToggleHideReview = (reviewId) => {
    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, status: r.status === 'HIDDEN' ? 'PUBLISHED' : 'HIDDEN' } : r
      )
    );
  };

  const handleMarkResolved = (msgId) => {
    setInquiries((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: 'RESOLVED' } : m))
    );
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] self-start md:self-center overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('VENDORS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'VENDORS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Farmers ({pendingFarmersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'USERS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users ({usersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MARKETS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'MARKETS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Markets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REVIEWS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'REVIEWS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Reviews</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MESSAGES')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'MESSAGES'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inbox</span>
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
        <AdminMarketsTab
          marketsList={marketsList}
          onOpenAddModal={() => showAlert({ title: 'Phase 4.16', message: 'Full Market CRUD API will be integrated in Phase 4.16.', type: 'info' })}
          onOpenEditModal={() => showAlert({ title: 'Phase 4.16', message: 'Full Market CRUD API will be integrated in Phase 4.16.', type: 'info' })}
          onDeleteMarket={handleDeleteMarket}
        />
      )}

      {activeTab === 'REVIEWS' && (
        <AdminReviewsModerationTab
          reviewsList={reviewsList}
          onToggleHideReview={handleToggleHideReview}
        />
      )}

      {activeTab === 'MESSAGES' && (
        <AdminMessagesTab
          inquiries={inquiries}
          onMarkResolved={handleMarkResolved}
        />
      )}
    </div>
  );
}
