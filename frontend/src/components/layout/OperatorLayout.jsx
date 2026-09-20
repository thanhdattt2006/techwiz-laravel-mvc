import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Headphones,
  Bell,
  LogOut,
  ArrowLeft,
  Radio,
  Clock,
} from 'lucide-react';

export default function OperatorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#1F2A37] flex flex-col font-sans">
      {/* Control Room Top Header */}
      <header className="bg-[#084298] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-white shadow">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-2">
                LifeLink <span className="text-blue-300">Dispatch Station</span>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                  <Radio className="w-3 h-3" /> Live Frequency
                </span>
              </div>
              <p className="text-[11px] text-blue-200">Emergency Call Taker & Vehicle Assignment</p>
            </div>
          </div>

          {/* Quick Info & User Action */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/60 border border-blue-700/50 text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span>Shift: Standard 4h Patrol</span>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user?.fullname}</p>
              <span className="text-[10px] font-mono text-blue-200 uppercase">ROLE: OPERATOR</span>
            </div>

            <Link
              to="/"
              className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Control Room Alert Ribbon */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>
              <strong>Dispatch Queue Active:</strong> Listening for 1-Touch SOS emergency beacons from patients across Chicago & regional sectors.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-700 hidden sm:inline">
            Status: Ready to Assign
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
