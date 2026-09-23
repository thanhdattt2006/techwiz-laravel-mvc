import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Store,
  LayoutDashboard,
  MessageSquare,
  Mail,
  LogOut,
  ArrowLeft,
  Activity,
  Globe,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? 'bg-[#16A34A] text-white shadow-xs'
        : 'text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A]'
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8DF] flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="p-5">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 pb-6 border-b border-[#E2E8DF] group">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#15803D] transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-[#0F172A]">
                Market<span className="text-[#16A34A]">Link</span> <span className="text-xs font-bold text-[#475569]">Admin</span>
              </div>
              <p className="text-[10px] text-[#475569] font-medium">Marketplace & Stall Oversight</p>
            </div>
          </Link>

          {/* Nav list */}
          <nav className="mt-6 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569] px-3 py-1">
              Core Oversight
            </div>
            <NavLink to="/admin/dashboard" className={navClass} end>
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </NavLink>

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569] px-3 pt-4 py-1">
              Market Operations
            </div>
            <NavLink to="/admin/dashboard" className={navClass}>
              <Store className="w-4 h-4 text-[#16A34A]" />
              <span>Markets & Stalls Registry</span>
            </NavLink>
            <NavLink to="/sitemap" className={navClass}>
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Platform Sitemap</span>
            </NavLink>

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569] px-3 pt-4 py-1">
              Community & Governance
            </div>
            <Link
              to="/feedback"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A] transition"
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Customer Reviews</span>
            </Link>
            <Link
              to="/contact"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A] transition"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold">Contact Messages</span>
            </Link>
          </nav>
        </div>

        {/* User Info & Sign out in sidebar */}
        <div className="p-5 border-t border-[#E2E8DF] space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
          <div className="flex items-center justify-between pt-1">
            <div className="text-left">
              <p className="text-xs font-bold text-[#0F172A] truncate w-32">{user?.fullname || 'Platform Admin'}</p>
              <span className="text-[10px] font-mono uppercase font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ROLE: ADMIN
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-[#475569] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8DF] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              MarketLink Administrative Console
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              <Activity className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Aiven Cloud & REST API Active</span>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] hover:underline"
            >
              Public Catalog
            </Link>
          </div>
        </header>

        {/* Page View Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
