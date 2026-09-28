import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, LogIn, LayoutDashboard, Heart } from 'lucide-react';

export default function NavbarMobileDrawer({
  isOpen,
  onClose,
  navLinks,
  cartCount,
  openCart,
  isAuthenticated,
  role,
  dashboardPath,
}) {
  if (!isOpen) return null;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
      isActive
        ? 'text-[#16A34A] bg-emerald-50 font-bold'
        : 'text-[#0F172A] hover:text-[#16A34A] hover:bg-slate-50'
    }`;

  return (
    <div className="lg:hidden border-t border-[#E2E8DF] bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={mobileNavLinkClass}
            end={link.end}
          >
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-3 border-t border-[#E2E8DF] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            onClose();
            openCart();
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50 text-[#16A34A] font-bold text-xs border border-emerald-200 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Market Basket</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-black">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        </button>

        {isAuthenticated && (role === 'customer' || role === 'user') && (
          <Link
            to="/user/dashboard?tab=favorites"
            onClick={onClose}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200 transition"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Favorites</span>
            </div>
            <span className="text-[10px] font-semibold text-rose-500">Wishlist</span>
          </Link>
        )}

        {!isAuthenticated ? (
          <Link
            to="/login"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-[#0F172A]"
          >
            <LogIn className="w-4 h-4 text-[#16A34A]" />
            <span>Sign In to Account</span>
          </Link>
        ) : (
          <Link
            to={dashboardPath}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-xs text-[#16A34A]"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Portal ({role})</span>
          </Link>
        )}

        <div className="text-[11px] text-[#475569] text-center pt-1">
          Chicago Farmers Market Helpline: <strong>(312) 555-FARM</strong>
        </div>
      </div>
    </div>
  );
}
