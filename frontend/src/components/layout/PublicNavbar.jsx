import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  ShoppingBag,
  PhoneCall,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Tractor,
  User,
  Mail,
} from 'lucide-react';

export default function PublicNavbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'farmer' || role === 'operator') return '/operator/dashboard';
    return '/user/dashboard';
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors ${
      isActive
        ? 'text-[#16A34A] bg-emerald-50 font-bold'
        : 'text-[#0F172A] hover:text-[#16A34A] hover:bg-emerald-50/50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8DF] shadow-xs">
      {/* Top Notice & Hotline Bar */}
      <div className="bg-[#15803D] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
            <span>🌿 Local Farmers Markets • Fresh Organic Harvest • Community Supported Agriculture</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:3125553276"
              className="flex items-center gap-1.5 font-bold hover:underline text-emerald-100"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              Hotline: (312) 555-FARM
            </a>
            <span className="text-emerald-300/60 hidden sm:inline">|</span>
            <a
              href="mailto:support@marketlink.org"
              className="hidden sm:flex items-center gap-1 text-emerald-100 hover:underline"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              support@marketlink.org
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-[#15803D] transition">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-[#0F172A] flex items-center gap-1.5">
              Market<span className="text-[#16A34A]">Link</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
                eGreen Basket
              </span>
            </div>
            <p className="text-[11px] text-[#475569] -mt-0.5 font-medium">
              Farm Fresh Just a Click Away
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/markets" className={navLinkClass}>
            Markets Directory
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Fresh Produce
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            Harvest Gallery
          </NavLink>
          <NavLink to="/feedback" className={navLinkClass}>
            Feedback
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <NavLink to="/sitemap" className={navLinkClass}>
            Sitemap
          </NavLink>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] hover:bg-emerald-100/80 text-xs font-bold transition shadow-xs"
              >
                {role === 'admin' && (
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                )}
                {(role === 'farmer' || role === 'operator') && (
                  <Tractor className="w-4 h-4 text-emerald-600" />
                )}
                {(role === 'customer' || role === 'user') && (
                  <User className="w-4 h-4 text-blue-600" />
                )}
                <span>
                  {user.fullname} ({role === 'operator' ? 'farmer' : role === 'user' ? 'customer' : role})
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
                className="p-2 text-[#475569] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition border border-[#E2E8DF]"
            >
              <LogIn className="w-4 h-4 text-[#16A34A]" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Pre-Order CTA Button */}
          <Link
            to="/products"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pre-Order Produce</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

