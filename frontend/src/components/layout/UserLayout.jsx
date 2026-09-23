import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  ArrowLeft,
  Sprout,
  ShoppingBag,
  SlidersHorizontal,
  Clock,
  Store,
} from 'lucide-react';

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex flex-col font-sans">
      {/* Shopper Hub Header */}
      <header className="bg-white border-b border-[#E2E8DF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#15803D] transition">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-[#0F172A]">
                  Market<span className="text-[#16A34A]">Link</span>
                </span>
                <span className="text-[10px] text-[#475569] block -mt-1 font-semibold uppercase tracking-wider">
                  Shopper Hub • eGreen Basket
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#0F172A]">{user?.fullname || 'Local Food Lover'}</p>
              <span className="text-[10px] font-mono text-[#16A34A] uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ROLE: SHOPPER
              </span>
            </div>

            <Link
              to="/products"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#16A34A] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
              title="Browse Weekly Harvest"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Browse Produce</span>
            </Link>

            <Link
              to="/"
              className="p-2 text-[#475569] hover:text-[#16A34A] hover:bg-emerald-50 rounded-lg transition"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

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
      </header>

      {/* Shopper Subnavigation Tabs */}
      <div className="bg-white border-b border-[#E2E8DF] shadow-xs sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2">
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6]'
              }`
            }
          >
            <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
            <span>Shopper Dashboard</span>
          </NavLink>

          <NavLink
            to="/user/history"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6]'
              }`
            }
          >
            <Clock className="w-4 h-4 text-[#16A34A]" />
            <span>My Pre-Orders & Stall Receipts</span>
          </NavLink>

          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6]'
              }`
            }
          >
            <SlidersHorizontal className="w-4 h-4 text-[#16A34A]" />
            <span>Account Settings & Preferences</span>
          </NavLink>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
