import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Layers, ArrowRight } from 'lucide-react';

export default function SitemapPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-[#0B6EFD]">
          Architecture Flow
        </span>
        <h1 className="text-3xl font-black tracking-tight text-[#1F2A37]">
          LifeLink Portal Sitemap
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7785]">
          A comprehensive overview of website hierarchy, public catalogs, and secure role-based portals.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Public Catalog Routes */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0] text-[#0B6EFD]">
            <Home className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#1F2A37]">Public Pages</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-[#6B7785]">
            <li>
              <Link to="/" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/ (Home Catalog & Filter)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Ambulance listing, regional search (Chicago), price sort.</p>
            </li>
            <li>
              <Link to="/about" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/about (About Us)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Coverage area, best performing fleet statistics.</p>
            </li>
            <li>
              <Link to="/gallery" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/gallery (Image Gallery)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Visual showcase of ICCU, ICU, and A/C units.</p>
            </li>
            <li>
              <Link to="/feedback" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/feedback (Feedback Form)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Star ratings and qualitative service review.</p>
            </li>
            <li>
              <Link to="/ambulances" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/ambulances (Fleet Catalog)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Multi-criteria filtering, sector search, price range, fleet inventory.</p>
            </li>
            <li>
              <Link to="/ambulances/1" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/ambulances/:id (Unit Specification)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Deep chassis specs, medical onboard equipment & pre-dispatch booking.</p>
            </li>
            <li>
              <Link to="/tracking/REQ-2026-8812" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/tracking/:id (Live SOS Tracking)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Real-time GPS route radar, ETA countdown, milestone rescue stages & crew info.</p>
            </li>
            <li>
              <Link to="/contact" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/contact (Contact Us & Command Map)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Chicago Central HQ radar, hotline, and guest message transmission.</p>
            </li>
            <li>
              <Link to="/not-found-preview" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>* (Medical 404 Error Page)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Heartbeat signal lost branding, recovery shortcuts & emergency hotline.</p>
            </li>
          </ul>
        </div>

        {/* Authentication & Access */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0] text-purple-600">
            <Users className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#1F2A37]">Authentication</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-[#6B7785]">
            <li>
              <Link to="/login" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/login (Access Gate)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">1-Click Demo Login for 3 roles & manual login.</p>
            </li>
            <li>
              <Link to="/unauthorized" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/unauthorized (403 Restrict)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Role security boundary protection barrier.</p>
            </li>
            <li className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-[#1F2A37] block">Client Session & RBAC:</span>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Secure client-side session management with role-based routing.</p>
            </li>
          </ul>
        </div>

        {/* Role Protected Portals */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0] text-emerald-600">
            <Layers className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#1F2A37]">Role Portals (RBAC)</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-[#6B7785]">
            <li>
              <Link to="/admin/dashboard" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/admin/dashboard (Admin)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Fleet management, driver directory, KPI statistics.</p>
            </li>
            <li>
              <Link to="/operator/dashboard" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/operator/dashboard (Operator)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Emergency SOS live queue and ambulance dispatch.</p>
            </li>
            <li>
              <Link to="/user/dashboard" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/user/dashboard (Patient)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">1-Touch Emergency SOS beacon, live tracker & clinical dossier snapshot.</p>
            </li>
            <li>
              <Link to="/user/medical-profile" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/user/medical-profile (Medical Dossier)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Blood group, chronic conditions, critical allergies & ICE contacts.</p>
            </li>
            <li>
              <Link to="/user/history" className="flex items-center justify-between font-semibold text-[#1F2A37] hover:text-[#0B6EFD]">
                <span>/user/history (Dispatch Ledger)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#6B7785] mt-0.5">Emergency transport history, clinical summaries & review submission.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
