import React from 'react';
import { DollarSign, ShoppingBag, Store, Users, Star, ArrowUpRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import AdminAnalyticsCharts from '../../pages/admin/AdminAnalyticsCharts';

/**
 * AdminOverviewTab (Phase 4.15)
 * Platform KPIs, revenue volume, live order lifecycle distribution,
 * and highest-rated farmers leaderboard.
 */
export default function AdminOverviewTab({ hook }) {
  const { stats, loading, error, refetch } = hook;

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 bg-white border border-[#E2E8DF] rounded-3xl p-8">
        <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
        <p className="text-xs text-[#475569] font-medium">Loading platform statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
        <button type="button" onClick={refetch} className="underline font-bold hover:text-rose-900 cursor-pointer">
          Try Again
        </button>
      </div>
    );
  }

  const grossRevenue = Number(stats.revenue?.gross_completed || 0).toFixed(2);
  const totalOrders = stats.orders?.total || 0;
  const activeFarmers = stats.users?.active_farmers || 0;
  const pendingFarmers = stats.users?.pending_farmers || 0;
  const totalCustomers = stats.users?.customers || 0;
  const topFarmers = stats.top_farmers || [];

  return (
    <div className="space-y-6">
      {/* 4 Core Platform Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Gross Settled</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">${grossRevenue}</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">USD</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">In-person market booth cash</p>
        </div>

        {/* Pre-Orders */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Pre-Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{totalOrders}</span>
            <span className="text-xs text-blue-600 font-bold ml-2">Crates</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">{stats.orders?.by_status?.completed || 0} fulfilled pickups</p>
        </div>

        {/* Farmers & Stalls */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Active Stalls</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{activeFarmers}</span>
            {pendingFarmers > 0 && (
              <span className="text-xs text-amber-600 font-bold ml-2">+{pendingFarmers} pending</span>
            )}
          </div>
          <p className="text-[11px] text-[#475569] mt-1">{stats.markets?.active || 0} active farmers markets</p>
        </div>

        {/* Shoppers */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Shoppers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{totalCustomers}</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">Registered</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">{stats.reviews?.platform_average || '5.0'}★ Platform Rating</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <AdminAnalyticsCharts stats={stats} />

      {/* Top 5 Farmers Leaderboard */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Highest Rated Farm Stalls</h3>
            <p className="text-xs text-[#475569]">Stall masters with the highest customer review ratings</p>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="p-2 rounded-xl text-slate-400 hover:text-[#16A34A] hover:bg-slate-50 transition cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {topFarmers.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No farmer reviews recorded yet.</p>
        ) : (
          <div className="divide-y divide-[#E2E8DF]">
            {topFarmers.map((f, idx) => (
              <div key={f.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-[#16A34A] font-mono font-bold text-xs flex items-center justify-center border border-emerald-200">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{f.stall_name || 'Farm Stall'}</h4>
                    <p className="text-[11px] text-[#475569]">{f.contact_person || f.user?.fullname || 'Grower'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{Number(f.avg_rating || 5.0).toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({f.review_count || 0})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
