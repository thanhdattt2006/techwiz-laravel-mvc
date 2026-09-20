import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Ambulance,
  PhoneCall,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Headphones,
  User,
} from 'lucide-react';

export default function PublicNavbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'operator') return '/operator/dashboard';
    return '/user/dashboard';
  };

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'text-[#0B6EFD] bg-blue-50 font-bold'
        : 'text-[#1F2A37] hover:text-[#0B6EFD] hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8F0] shadow-xs">
      {/* Top Hotline Bar */}
      <div className="bg-[#084298] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>24/7 LifeLink eAmbulance Dispatch Control Center</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:03011111234"
              className="flex items-center gap-1.5 font-bold hover:underline text-emerald-300"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#DC3545] fill-[#DC3545]" />
              Hotline: 030-1111-1234
            </a>
            <span className="text-blue-200 hidden sm:inline">|</span>
            <span className="text-blue-200 hidden sm:inline">healthcare@icu.com</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-[#0B6EFD] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-[#084298] transition">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-[#1F2A37] flex items-center gap-1.5">
              Life<span className="text-[#0B6EFD]">Link</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-[#DC3545] border border-red-200">
                eAmbulance
              </span>
            </div>
            <p className="text-[11px] text-[#6B7785] -mt-0.5 font-medium">Emergency Medical Dispatch</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <NavLink to="/" className={navLinkClass} end>
            Home Catalog
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            Image Gallery
          </NavLink>
          <NavLink to="/feedback" className={navLinkClass}>
            Feedback
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
          <NavLink to="/sitemap" className={navLinkClass}>
            Sitemap
          </NavLink>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0B6EFD] hover:bg-blue-100/80 text-xs font-bold transition shadow-xs"
              >
                {role === 'admin' && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                {role === 'operator' && <Headphones className="w-4 h-4 text-blue-600" />}
                {role === 'user' && <User className="w-4 h-4 text-emerald-600" />}
                <span>
                  {user.fullname} ({role})
                </span>
                <LayoutDashboard className="w-3.5 h-3.5 opacity-70" />
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                title="Sign Out"
                className="p-2 text-[#6B7785] hover:text-[#DC3545] hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Demo</span>
            </Link>
          )}

          {/* Quick SOS Trigger Button */}
          <Link
            to={isAuthenticated ? '/user/dashboard' : '/login'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white text-xs font-extrabold transition shadow-md shadow-red-500/20 animate-pulse"
          >
            <Ambulance className="w-4 h-4" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
