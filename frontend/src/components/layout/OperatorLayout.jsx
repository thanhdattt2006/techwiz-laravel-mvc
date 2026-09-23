import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Store,
  LogOut,
  ArrowLeft,
  Clock,
  Sprout,
} from 'lucide-react';

export default function OperatorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center font-bold text-white shadow-xs group-hover:bg-[#15803D] transition">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-[#0F172A] flex items-center gap-2">
                  Market<span className="text-[#16A34A]">Link</span>
                  <span className="text-xs font-bold text-[#475569] font-normal">| Stall Master Station</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    Market Session Live
                  </span>
                </div>
                <p className="text-[11px] text-[#475569]">
                  Green City Market • Stall #04 (Prairie Organic Grove)
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Info & User Action */}
          <div className="flex items-center gap-4">
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
              to="/"
              className="p-2 text-[#475569] hover:text-[#16A34A] hover:bg-emerald-50 rounded-xl transition"
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
