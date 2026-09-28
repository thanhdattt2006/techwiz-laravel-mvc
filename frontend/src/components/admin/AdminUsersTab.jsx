import React from 'react';
import { Users, Search, UserCheck, UserX, Loader2, AlertCircle, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * AdminUsersTab (Phase 4.15)
 * Users governance, real-time search, multi-criteria filtering, and ban/unban controls.
 */
export default function AdminUsersTab({ hook }) {
  const {
    users,
    filteredUsers,
    loading,
    error,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    actionLoadingId,
    handleToggleStatus,
    refetch,
  } = hook;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A]">User Accounts Governance</h2>
            <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {users.length} Registered Accounts
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Audit platform accounts, verify customer credentials, and enforce community conduct.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="p-2.5 rounded-xl border border-[#E2E8DF] text-slate-500 hover:text-[#16A34A] hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
          title="Refresh users"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or stall name..."
            className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          />
        </div>

        {/* Role & Status Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          >
            <option value="ALL">All Roles</option>
            <option value="customer">Shoppers (Customer)</option>
            <option value="farmer">Growers (Farmer)</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active Accounts</option>
            <option value="banned">Banned Accounts</option>
            <option value="pending">Pending Accounts</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-xs text-[#475569] font-medium">Loading user accounts...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={refetch} className="underline font-bold hover:text-rose-900 cursor-pointer">
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="text-center py-12 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAF6] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#0F172A]">No accounts found</h4>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            No users match your search query or filter settings.
          </p>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8DF]">
              {filteredUsers.map((u) => {
                const isLoading = actionLoadingId === u.id;
                const isBanned = u.status === 'banned';

                return (
                  <tr key={u.id} className="hover:bg-[#F8FAF6]/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/default-avatar.svg"
                          alt="Avatar"
                          className="w-7 h-7 rounded-full border border-slate-200 shrink-0 object-cover"
                        />
                        <div>
                          <span className="font-bold text-[#0F172A] block">{u.fullname || 'Unnamed'}</span>
                          <span className="text-[11px] text-[#475569]">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'farmer'
                            ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {u.phone || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={u.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs disabled:opacity-50 ${
                            isBanned
                              ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : isBanned ? (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          )}
                          <span>{isBanned ? 'Unban' : 'Ban'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
