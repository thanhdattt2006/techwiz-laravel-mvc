import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Store,
  Users,
  MessageSquare,
  Mail,
  BarChart3,
  LogOut,
  ArrowLeft,
  Activity,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route / param change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentTab = new URLSearchParams(location.search).get('tab') || 'markets';

  const navItems = [
    {
      id: 'markets',
      label: 'Markets Registry',
      icon: Store,
      tab: 'markets',
      description: 'Hubs, stalls & schedules',
    },
    {
      id: 'vendors',
      label: 'Stall Applications',
      icon: ShieldCheck,
      tab: 'vendors',
      description: 'Audit farmer credentials',
    },
    {
      id: 'users',
      label: 'User Accounts',
      icon: Users,
      tab: 'users',
      description: 'Manage shoppers & growers',
    },
    {
      id: 'reviews',
      label: 'Review Moderation',
      icon: MessageSquare,
      tab: 'reviews',
      description: 'Curate community feedback',
    },
    {
      id: 'messages',
      label: 'Inquiries Inbox',
      icon: Mail,
      tab: 'messages',
      description: 'Support & partner requests',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      tab: 'reports',
      description: 'Sales volume & top farms',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex font-sans">
      {/* 1. Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8DF] flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="p-5">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 pb-6 border-b border-[#E2E8DF] group">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#15803D] transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-[#0F172A]">
                Market<span className="text-[#16A34A]">Link</span>{' '}
                <span className="text-xs font-bold text-[#475569]">Admin</span>
              </div>
              <p className="text-[10px] text-[#475569] font-medium">Marketplace & Stall Oversight</p>
            </div>
          </Link>

          {/* Navigation list */}
          <nav className="mt-5 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-3 py-1">
              Platform Governance
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.tab;
              return (
                <Link
                  key={item.id}
                  to={`/admin/dashboard?tab=${item.tab}`}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#16A34A]'}`} />
                  <div className="flex-1 truncate">
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </Link>
              );
            })}

            {/* Public Live Site Shortcuts */}
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-3 pt-5 py-1">
              Live Public Shortcuts
            </div>
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A] transition"
            >
              <span>Main Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/products"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A] transition"
            >
              <span>Produce Catalog</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/sitemap"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A] transition"
            >
              <span>Public Sitemap</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
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

      {/* 2. Mobile Drawer Navigation (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-[#0F172A]">
                    Market<span className="text-[#16A34A]">Link</span> Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="mt-4 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-2 py-1">
                  Admin Governance
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.tab;
                  return (
                    <Link
                      key={item.id}
                      to={`/admin/dashboard?tab=${item.tab}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#16A34A] text-white'
                          : 'text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#16A34A]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-2 pt-4 py-1">
                  Public Links
                </div>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-50"
                >
                  <span>Main Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-50"
                >
                  <span>Produce Catalog</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  to="/sitemap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-50"
                >
                  <span>Platform Sitemap</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </nav>
            </div>

            {/* Mobile Footer with User info & logout */}
            <div className="pt-4 border-t border-[#E2E8DF] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">{user?.fullname || 'Platform Admin'}</p>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#16A34A]">ROLE: ADMIN</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8DF] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6] transition cursor-pointer"
              title="Open Navigation Menu"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span className="hidden sm:inline">MarketLink Administrative Console</span>
              <span className="sm:hidden">MarketLink Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              <Activity className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="hidden sm:inline">Aiven Cloud & REST API Active</span>
              <span className="sm:hidden">API Active</span>
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
