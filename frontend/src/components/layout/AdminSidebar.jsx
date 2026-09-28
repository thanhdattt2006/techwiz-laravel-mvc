import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, LogOut } from 'lucide-react';

/**
 * AdminSidebar (Phase 4.17)
 * Collapsible sticky desktop navigation for Admin Governance Portal.
 */
export default function AdminSidebar({
  isCollapsed,
  toggleCollapse,
  currentTab,
  navItems,
  user,
  handleLogout,
}) {
  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0 bg-white border-r border-[#E2E8DF] flex flex-col justify-between shrink-0 hidden lg:flex transition-all duration-300 z-30 overflow-hidden`}
    >
      {/* Top Scrollable Section: Brand & Nav Links */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Brand & Desktop Collapse Button */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} pb-4 border-b border-[#E2E8DF]`}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#15803D] transition shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <div className="text-base font-black tracking-tight text-[#0F172A]">
                  Market<span className="text-[#16A34A]">Link</span>{' '}
                  <span className="text-xs font-bold text-[#475569]">Admin</span>
                </div>
                <p className="text-[10px] text-[#475569] font-medium truncate w-32">Stall & Market Hub</p>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand Button When Collapsed */}
        {isCollapsed && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation list */}
        <nav className="mt-4 space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-3 py-1">
              Platform Governance
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <Link
                key={item.id}
                to={`/admin/dashboard?tab=${item.tab}`}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'gap-3 px-3.5'
                } py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#16A34A]'}`} />
                {!isCollapsed && (
                  <>
                    <div className="flex-1 truncate">
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </>
                )}
              </Link>
            );
          })}

          {!isCollapsed && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] px-3 pt-5 py-1">
                Live Public Shortcuts
              </div>
              <Link
                to="/"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A] transition"
              >
                <span>Main Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAF6] hover:text-[#0F172A] transition"
              >
                <span>Produce Catalog</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Pinned Footer */}
      <div className="p-4 border-t border-[#E2E8DF] bg-white space-y-2 shrink-0">
        {!isCollapsed ? (
          <>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Site</span>
            </Link>
            <div className="flex items-center justify-between pt-1">
              <div className="text-left">
                <p className="text-xs font-bold text-[#0F172A] truncate w-32">{user?.fullname || 'Platform Admin'}</p>
                <span className="text-[10px] font-mono uppercase font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ROLE: ADMIN
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-[#475569] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <Link to="/" className="p-2 text-[#475569] hover:text-[#16A34A] hover:bg-emerald-50 rounded-xl transition" title="Return to Public Site">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <button type="button" onClick={handleLogout} className="p-2 text-[#475569] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
