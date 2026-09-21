import React from 'react';
import { Award, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-[#0B6EFD]">
          About LifeLink eAmbulance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F2A37]">
          Connecting Communities With Critical Emergency Care
        </h1>
        <p className="text-sm text-[#6B7785] leading-relaxed">
          LifeLink was developed as an emergency healthcare innovation to revolutionize emergency patient transport with speed, modern logistics, and transparent vehicle capabilities.
        </p>
      </div>

      {/* Coverage & Fleet Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#0B6EFD]">14+</div>
          <div className="text-xs font-bold text-[#1F2A37] mt-1">Metropolitan Regions</div>
          <p className="text-[11px] text-[#6B7785] mt-0.5">Active coverage across Chicago and surrounding counties</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#198754]">100%</div>
          <div className="text-xs font-bold text-[#1F2A37] mt-1">Certified Medical Staff</div>
          <p className="text-[11px] text-[#6B7785] mt-0.5">Licensed paramedics and emergency trauma nurses</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#DC3545]">7.2m</div>
          <div className="text-xs font-bold text-[#1F2A37] mt-1">Average Arrival Speed</div>
          <p className="text-[11px] text-[#6B7785] mt-0.5">Measured from initial 1-Touch beacon</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-purple-600">98.9%</div>
          <div className="text-xs font-bold text-[#1F2A37] mt-1">Positive Feedback Rating</div>
          <p className="text-[11px] text-[#6B7785] mt-0.5">Verified ratings submitted by transported patients</p>
        </div>
      </div>

      {/* Best Performing eAmbulance Units */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Best Performing eAmbulance Fleet Units</span>
          </h2>
          <p className="text-xs text-[#6B7785] mt-1">
            Recognized for lowest arrival latency, zero mechanical downtime, and superior clinical patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F5F8FC]/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                Unit #101 (ICCU)
              </span>
              <span className="text-[11px] font-bold text-emerald-600">★ 4.98 Rating</span>
            </div>
            <h3 className="text-sm font-bold text-[#1F2A37]">Mercedes Sprinter 3500 Mobile ICU</h3>
            <p className="text-xs text-[#6B7785]">142 Emergency responses in Chicago Central. Specialized cardiac telemetry and advanced respiratory life support.</p>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F5F8FC]/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Unit #102 (ICU)
              </span>
              <span className="text-[11px] font-bold text-emerald-600">★ 4.95 Rating</span>
            </div>
            <h3 className="text-sm font-bold text-[#1F2A37]">Ford Transit 250 Life Support</h3>
            <p className="text-xs text-[#6B7785]">118 Urgent dispatches in Chicago Downtown. High agility in heavy city traffic with integrated GPS routing.</p>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F5F8FC]/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                Unit #106 (A/C)
              </span>
              <span className="text-[11px] font-bold text-emerald-600">★ 4.92 Rating</span>
            </div>
            <h3 className="text-sm font-bold text-[#1F2A37]">RAM ProMaster 2500 Dual A/C</h3>
            <p className="text-xs text-[#6B7785]">97 Smooth inter-hospital transports. Maximum patient comfort with pneumatic shock damping.</p>
          </div>
        </div>
      </section>

      {/* Creators & Project Governance */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B6EFD] flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F2A37]">Project Architecture & Creators</h2>
            <p className="text-xs text-[#6B7785]">Developed for TechWiz 7: Web Innovation Unleashed Competition</p>
          </div>
        </div>
        <p className="text-xs text-[#6B7785] leading-relaxed">
          The LifeLink platform was engineered as an ultra-responsive <strong>React 19 Single Page Application (SPA)</strong> with modern component architecture and high-performance client data services. Built in strict accordance with TechWiz 7 eAmbulance specifications, modern UI/UX design standards, and accessibility guidelines.
        </p>
      </section>
    </div>
  );
}
