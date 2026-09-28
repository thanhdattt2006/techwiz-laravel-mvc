import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useModal } from '../../context/ModalContext';
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
  Menu,
  X,
  Heart,
} from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';
import NavbarMobileDrawer from './NavbarMobileDrawer';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/markets', label: 'Markets' },
  { to: '/products', label: 'Produce' },
  { to: '/about', label: 'About' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/contact', label: 'Contact' },
  { to: '/sitemap', label: 'Sitemap' },
];

export default function PublicNavbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { showConfirm } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFavoritesClick = async () => {
    if (isAuthenticated) {
      navigate('/user/dashboard?tab=favorites');
      return;
    }
    const confirmed = await showConfirm({
      title: 'Sign In Required',
      message: 'Please sign in to view and save your favorite farmers markets and fresh harvests.',
      type: 'info',
      confirmText: 'Sign In',
      cancelText: 'Stay as Guest',
    });
    if (confirmed) {
      navigate('/login', { state: { from: location } });
    }
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'farmer' || role === 'operator') return '/operator/dashboard';
    return '/user/dashboard';
  };

  const navLinkClass = ({ isActive }) =>
    `px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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
            <a href="tel:3125553276" className="flex items-center gap-1.5 font-bold hover:underline text-emerald-100">
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              Hotline: (312) 555-FARM
            </a>
            <span className="text-emerald-300/60 hidden sm:inline">|</span>
            <a href="mailto:support@marketlink.org" className="hidden sm:flex items-center gap-1 text-emerald-100 hover:underline">
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              support@marketlink.org
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <img src="/logo.png" alt="MarketLink Logo" className="w-10 h-10 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform" />
          <div>
            <div className="text-lg font-black tracking-tight text-[#0F172A] flex items-center gap-1.5">
              Market<span className="text-[#16A34A]">Link</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
                eGreen Basket
              </span>
            </div>
            <p className="text-[10px] text-[#475569] -mt-0.5 font-medium hidden sm:block">
              Farm Fresh Just a Click Away
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && <NotificationDropdown />}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] hover:bg-emerald-100/80 text-xs font-bold transition shadow-xs whitespace-nowrap"
              >
                {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />}
                {(role === 'farmer' || role === 'operator') && <Tractor className="w-3.5 h-3.5 text-emerald-600" />}
                {(role === 'customer' || role === 'user') && <User className="w-3.5 h-3.5 text-blue-600" />}
                <span className="hidden xl:inline">{user.fullname}</span>
                <span className="xl:hidden">Portal</span>
                <LayoutDashboard className="w-3.5 h-3.5 opacity-70" />
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                title="Sign Out"
                className="p-1.5 text-[#475569] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition border border-[#E2E8DF] whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Favorites Wishlist Trigger Button */}
          <button
            type="button"
            onClick={handleFavoritesClick}
            aria-label="View Saved Favorites"
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-[#0F172A] hover:text-rose-600 border border-[#E2E8DF] transition cursor-pointer"
            title="Saved Favorites"
          >
            <Heart className="w-4 h-4 text-rose-500" />
          </button>

          {/* Shopping Basket Trigger Button */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Open Market Basket"
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-[#16A34A] border border-[#E2E8DF] transition cursor-pointer"
            title="View Market Basket"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#16A34A] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Pre-Order CTA Button */}
          <Link
            to="/products"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Pre-Order</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0F172A] hover:bg-emerald-50 hover:text-[#16A34A] rounded-xl lg:hidden transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Sub-component */}
      <NavbarMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
        cartCount={cartCount}
        openCart={openCart}
        isAuthenticated={isAuthenticated}
        role={role}
        dashboardPath={getDashboardPath()}
      />
    </header>
  );
}
