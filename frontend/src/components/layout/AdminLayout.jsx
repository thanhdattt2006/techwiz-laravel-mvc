import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Ambulance,
  LayoutDashboard,
  Users,
  MessageSquare,
  Mail,
  LogOut,
  ArrowLeft,
  Activity,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[#0B6EFD] text-white shadow-md shadow-blue-500/20'
        : 'text-[#1F2A37] hover:bg-slate-100 hover:text-[#0B6EFD]'
    }`;

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#1F2A37] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="p-5">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 pb-6 border-b border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-[#1F2A37]">
                LifeLink <span className="text-purple-600">Admin</span>
              </div>
              <p className="text-[10px] text-[#6B7785] font-medium">Control & Fleet Oversight</p>
            </div>
          </Link>

          {/* Nav list */}
          <nav className="mt-6 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7785] px-3 py-1">
              Core Operations
            </div>
            <NavLink to="/admin/dashboard" className={navClass} end>
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </NavLink>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7785] px-3 pt-4 py-1">
              Fleet & Management
            </div>
            <NavLink
              to="/admin/dashboard"
              className={navClass}
            >
              <Ambulance className="w-4 h-4 text-[#0B6EFD]" />
              <span>Fleet Inventory</span>
            </NavLink>
            <NavLink
              to="/sitemap"
              className={navClass}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>System Directory</span>
            </NavLink>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7785] px-3 pt-4 py-1">
              Communication
            </div>
            <Link
              to="/feedback"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#1F2A37] hover:bg-slate-100 hover:text-[#0B6EFD] transition"
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Patient Feedbacks</span>
            </Link>
            <Link
              to="/contact"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#1F2A37] hover:bg-slate-100 hover:text-[#0B6EFD] transition"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              <span>Contact Messages</span>
            </Link>
          </nav>
        </div>

        {/* User Info & Sign out in sidebar */}
        <div className="p-5 border-t border-[#E2E8F0] space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#6B7785] hover:text-[#1F2A37] hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
          <div className="flex items-center justify-between pt-1">
            <div className="text-left">
              <p className="text-xs font-bold text-[#1F2A37] truncate w-32">{user?.fullname}</p>
              <span className="text-[10px] font-mono uppercase font-semibold text-purple-600">ROLE: ADMIN</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-[#6B7785] hover:text-[#DC3545] hover:bg-red-50 rounded-lg transition cursor-pointer"
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
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-[#1F2A37] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              Administrative Console
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>Aiven DB & API Connected</span>
            </div>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#0B6EFD] hover:underline"
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
