import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Store,
  Users,
  MessageSquare,
  Mail,
  BarChart3,
  Activity,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Tag,
  Bell,
} from 'lucide-react';
import { useAdminOverview } from '../../hooks/useAdminOverview';
import NotificationDropdown from '../common/NotificationDropdown';
import AdminSidebar from './AdminSidebar';
import AdminMobileDrawer from './AdminMobileDrawer';

/**
 * AdminLayout (Phase 4.18)
 * Layout shell for Platform Governance with Notification Dropdown and responsive navigation.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('marketlink_admin_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const { stats } = useAdminOverview();
  const pendingFarmersCount = stats?.users?.pending_farmers || 0;
  const unreadInquiriesCount = stats?.inquiries?.unread || 0;

  const navItems = [
    { id: 'overview', label: 'Overview & Analytics', icon: BarChart3, tab: 'overview' },
    { id: 'markets', label: 'Markets Registry', icon: Store, tab: 'markets' },
    { id: 'categories', label: 'Produce Categories', icon: Tag, tab: 'categories' },
    {
      id: 'vendors',
      label: 'Stall Applications',
      icon: ShieldCheck,
      tab: 'vendors',
      badge: pendingFarmersCount > 0 ? pendingFarmersCount : null,
    },
    { id: 'moderation', label: 'Review & Products', icon: MessageSquare, tab: 'moderation' },
    { id: 'users', label: 'User Accounts', icon: Users, tab: 'users' },
    { id: 'notices', label: 'System Bulletins', icon: Bell, tab: 'notices' },
    {
      id: 'messages',
      label: 'Inquiries Inbox',
      icon: Mail,
      tab: 'messages',
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : null,
    },
  ];

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('marketlink_admin_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex font-sans">
      {/* 1. Desktop Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        currentTab={currentTab}
        navItems={navItems}
        user={user}
        handleLogout={handleLogout}
      />

      {/* 2. Mobile Drawer Navigation */}
      <AdminMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentTab={currentTab}
        navItems={navItems}
        user={user}
        handleLogout={handleLogout}
      />

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8DF] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6] transition cursor-pointer"
              title="Open Navigation Menu"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex p-2 rounded-xl text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6] transition cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            <div className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span className="hidden sm:inline">MarketLink Administrative Console</span>
              <span className="sm:hidden">MarketLink Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              <Activity className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Aiven Cloud & REST API Active</span>
            </div>

            {/* In-App Notifications Dropdown */}
            <NotificationDropdown />

            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] hover:underline"
            >
              Catalog
            </Link>
          </div>
        </header>

        {/* Page View Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
