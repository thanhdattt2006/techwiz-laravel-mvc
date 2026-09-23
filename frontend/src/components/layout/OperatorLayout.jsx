import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Store,
  LogOut,
  ArrowLeft,
  Clock,
  Sprout,
  Menu,
  X,
  Layers,
  ExternalLink,
  Settings,
} from 'lucide-react';

export default function OperatorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex flex-col font-sans">
      {/* Stall Master Top Header */}
      <header className="bg-white border-b border-[#E2E8DF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center font-bold text-white shadow-xs group-hover:bg-[#15803D] transition">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-[#0F172A] flex items-center gap-2">
                  Market<span className="text-[#16A34A]">Link</span>
                  <span className="text-xs font-bold text-[#475569] font-normal hidden sm:inline">| Stall Master</span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    Session Live
                  </span>
                </div>
                <p className="text-[11px] text-[#475569] truncate max-w-[200px] sm:max-w-none">
                  Green City Market • Stall #04 (Prairie Organic Grove)
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Info & User Action */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8DF] text-xs font-medium text-[#475569]">
              <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Saturday Session: 07:00 AM – 01:00 PM</span>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#0F172A]">{user?.fullname || 'Marcus Jenkins (Grower)'}</p>
              <span className="text-[10px] font-mono text-[#16A34A] uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ROLE: STALL MASTER
              </span>
            </div>

            <Link
              to="/farmer/dashboard?tab=settings"
              className="p-2 text-[#475569] hover:text-[#16A34A] hover:bg-emerald-50 rounded-xl transition hidden sm:inline-flex"
              title="Stall Settings & Security"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="p-2 text-[#475569] hover:text-[#16A34A] hover:bg-emerald-50 rounded-xl transition hidden sm:inline-flex"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (< 1024px) */}
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
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-[#0F172A]">Stall Master Control</span>
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

              {/* Mobile Quick Links */}
              <nav className="mt-4 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-2 py-1">
                  Stall Management
                </div>
                <Link
                  to="/farmer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#16A34A] text-white"
                >
                  <Layers className="w-4 h-4" />
                  <span>Stall Dashboard</span>
                </Link>

                <Link
                  to="/farmer/dashboard?tab=settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A]"
                >
                  <Settings className="w-4 h-4" />
                  <span>Stall Settings & Password</span>
                </Link>

                <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-2 pt-4 py-1">
                  Public Storefront
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
                  to="/markets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-50"
                >
                  <span>Markets Directory</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-[#E2E8DF] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">{user?.fullname || 'Marcus Jenkins'}</p>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#16A34A]">STALL MASTER</span>
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

      {/* Stall Master Active Ribbon */}
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-900">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>
              <strong>Stall Pre-Order Queue Active:</strong> Morning harvest packed in tote crates. Please verify customer inspection before accepting cash at stall.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#16A34A] hidden sm:inline">
            Stall Status: Open & Accepting Pickups
          </span>
        </div>
      </div>

      {/* Main Control Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
