import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import CartDrawer from '../common/CartDrawer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#1F2A37] flex flex-col font-sans">
      <PublicNavbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
