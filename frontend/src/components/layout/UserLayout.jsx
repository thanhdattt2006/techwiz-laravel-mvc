import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  ArrowLeft,
  HeartPulse,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#1F2A37] flex flex-col font-sans">
      {/* Patient Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-[#1F2A37]">
                  Life<span className="text-emerald-600">Care</span>
                </span>
                <span className="text-[10px] text-[#6B7785] block -mt-1 font-medium">Patient Portal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#1F2A37]">{user?.fullname}</p>
              <span className="text-[10px] font-mono text-emerald-600 uppercase font-semibold">
                ROLE: PATIENT
              </span>
            </div>

            <Link
              to="/"
              className="p-2 text-[#6B7785] hover:text-[#0B6EFD] hover:bg-slate-100 rounded-lg transition"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

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
      </header>

      {/* Patient Subnavigation Tabs */}
      <div className="bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2">
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-[#6B7785] hover:text-[#1F2A37] hover:bg-slate-50'
              }`
            }
          >
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>1-Touch SOS Beacon</span>
          </NavLink>

          <NavLink
            to="/user/medical-profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-[#0B6EFD] border border-blue-200'
                  : 'text-[#6B7785] hover:text-[#1F2A37] hover:bg-slate-50'
              }`
            }
          >
            <ShieldCheck className="w-4 h-4 text-[#0B6EFD]" />
            <span>Emergency Medical Profile</span>
          </NavLink>

          <NavLink
            to="/user/history"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-[#6B7785] hover:text-[#1F2A37] hover:bg-slate-50'
              }`
            }
          >
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Transport History & Feedback</span>
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
