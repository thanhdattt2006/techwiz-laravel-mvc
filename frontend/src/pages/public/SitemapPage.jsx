import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, ArrowRight, Lock } from 'lucide-react';

export default function SitemapPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
          Platform Architecture • Directory Sitemap
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
          MarketLink Platform Sitemap
        </h1>
        <p className="text-xs sm:text-sm text-[#475569]">
          A comprehensive architectural overview of website navigation, public marketplace catalogs, and secure role-based portals.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Public Catalog Routes */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8DF] text-[#16A34A]">
            <Home className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#0F172A]">Public Marketplace</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-[#475569]">
            <li>
              <Link to="/" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/ (Landing & Home)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Hero banner, featured Chicago markets, seasonal produce, 3-step guide.</p>
            </li>
            <li>
              <Link to="/markets" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/markets (Markets Directory)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">6 Chicago farmers markets, interactive OpenStreetMap, operating days.</p>
            </li>
            <li>
              <Link to="/products" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/products (Fresh Produce)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Multi-criteria filtering by category, price slider, and organic certified status.</p>
            </li>
            <li>
              <Link to="/products/1" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/products/:id (Pre-Order Detail)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Farm origin, harvest timestamps, pickup day & slot selector, cash slip.</p>
            </li>
            <li>
              <Link to="/tracking/MLB-2026-8819" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/tracking/:id (Pickup Tracker)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">4-step progress stepper, stall directions, countdown timer, print pass.</p>
            </li>
            <li>
              <Link to="/about" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/about (About MarketLink)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Zero food miles mission, family farm profiles, SRS compliance standards.</p>
            </li>
            <li>
              <Link to="/gallery" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/gallery (Harvest Gallery)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Visual documentation of certified farm stalls and seasonal harvests.</p>
            </li>
            <li>
              <Link to="/feedback" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/feedback (Customer Reviews)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">1-5 star ratings and qualitative reviews submitted by shoppers.</p>
            </li>
            <li>
              <Link to="/contact" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/contact (Contact Market Office)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Chicago Green Loop HQ locator map, helpline, and manager inquiry form.</p>
            </li>
          </ul>
        </div>

        {/* Role Portals */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8DF] text-purple-600">
            <Users className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#0F172A]">Role Portals</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-[#475569]">
            <li>
              <Link to="/user/dashboard" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/user/dashboard (Shopper)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Active pickup reservations, pickup day reminders, and local farm favorites.</p>
            </li>
            <li>
              <Link to="/user/history" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/user/history (Order Log)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Past market visits, itemized in-person cash receipts, and re-order shortcuts.</p>
            </li>
            <li>
              <Link to="/user/profile" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/user/profile (Account)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Shopper contact info, preferred pickup markets, and SMS pickup alerts.</p>
            </li>
            <li>
              <Link to="/operator/dashboard" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/operator/dashboard (Operator)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Stall Master queue: real-time crate check-in, customer inspection, cash collection.</p>
            </li>
            <li>
              <Link to="/admin/dashboard" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/admin/dashboard (Admin)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Market registry, stall allocations, produce categories, and platform analytics.</p>
            </li>
          </ul>
        </div>

        {/* Security & Access */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8DF] text-blue-600">
            <Lock className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#0F172A]">Security & Access</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-[#475569]">
            <li>
              <Link to="/login" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/login (Authentication)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Multi-role credential sign in with instant demo autofill buttons.</p>
            </li>
            <li>
              <Link to="/register" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/register (Registration)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Local consumer registration with address validation and terms acceptance.</p>
            </li>
            <li>
              <Link to="/forgot-password" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/forgot-password (Recovery)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Self-service password reset code dispatcher with email simulation.</p>
            </li>
            <li>
              <Link to="/unauthorized" className="flex items-center justify-between font-semibold text-[#0F172A] hover:text-[#16A34A]">
                <span>/unauthorized (403 Forbidden)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#475569] mt-0.5">Restricted area interceptor for mismatched role credentials.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
