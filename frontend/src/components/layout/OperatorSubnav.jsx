import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Sliders,
  Calendar,
  MapPin,
  Star,
  Settings,
} from 'lucide-react';

/**
 * OperatorSubnav Component
 * Standardized sticky subnavigation bar for the Farmer & Stall Master portal.
 * Matches the layout and aesthetic of UserLayout's Shopper Subnav.
 */
export default function OperatorSubnav() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = (searchParams.get('tab') || 'queue').toLowerCase();
  const basePath = location.pathname.startsWith('/operator') ? '/operator/dashboard' : '/farmer/dashboard';

  const navItems = [
    { id: 'queue', label: 'Pickup Queue', icon: ShoppingBag },
    { id: 'stock', label: 'Stock Inventory', icon: Sliders },
    { id: 'weekly', label: 'Weekly Rollover', icon: Calendar },
    { id: 'markets', label: 'Market Stalls', icon: MapPin },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'settings', label: 'Stall Settings & Hours', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-[#E2E8DF] shadow-xs sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <NavLink
              key={item.id}
              to={`${basePath}?tab=${item.id}`}
              className={() =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 shadow-2xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6]'
                }`
              }
            >
              <Icon className="w-4 h-4 text-[#16A34A]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
