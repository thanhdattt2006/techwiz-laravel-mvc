import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, ChevronRight, ExternalLink, LogOut } from 'lucide-react';

/**
 * AdminMobileDrawer (Phase 4.17)
 * Slide-over drawer navigation for mobile and tablet devices.
 */
export default function AdminMobileDrawer({
  isOpen,
  onClose,
  currentTab,
  navItems,
  user,
  handleLogout,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-[#0F172A]">MarketLink Admin</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="mt-4 space-y-1">
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
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#16A34A]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </Link>
              );
            })}

            <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-3 pt-4 py-1">
              Public Shortcuts
            </div>
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-50"
            >
              <span>Main Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/products"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-50"
            >
              <span>Produce Catalog</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-[#E2E8DF] flex items-center justify-between">
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
  );
}
