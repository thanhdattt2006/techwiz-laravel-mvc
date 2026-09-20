import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Ambulance,
  Users,
  Activity,
  MessageSquare,
  Mail,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Clock,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
            Role: System Administrator
          </span>
          <h1 className="text-2xl font-black text-[#1F2A37] mt-2">
            Welcome back, {user?.fullname || 'Admin'}
          </h1>
          <p className="text-xs text-[#6B7785] mt-1">
            LifeLink eAmbulance System Management Console • Chicago Metropolitan Sector
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Add New Ambulance form ready for Day 2!')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Ambulance Unit</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Total Fleet Size</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">6 Units</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Operational
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B6EFD] flex items-center justify-center">
            <Ambulance className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Emergency Requests</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">24 Calls</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> Avg 7.2m Arrival
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC3545] flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Patient Feedbacks</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">18 Reviews</div>
            <span className="text-[11px] text-purple-600 font-bold flex items-center gap-1 mt-1">
              ★ 4.96 Average Rating
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Inbound Inquiries</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">5 Unread</div>
            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> Contact Us Form
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Fleet Overview Table Preview */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#1F2A37]">Fleet Inventory Overview</h2>
            <p className="text-xs text-[#6B7785]">Preview of categorized emergency units available for dispatch</p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0B6EFD]">Phase 0.6 Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8FC] text-[#6B7785] uppercase tracking-wider font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Unit #</th>
                <th className="py-3 px-4">Model Description</th>
                <th className="py-3 px-4">Type Class</th>
                <th className="py-3 px-4">Operating Region</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#1F2A37]">
              <tr>
                <td className="py-3 px-4 font-mono font-bold">AMB-CHI-101</td>
                <td className="py-3 px-4 font-semibold">Mercedes Sprinter 3500 Mobile ICU</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">ICCU</span></td>
                <td className="py-3 px-4 text-[#6B7785]">Chicago Central</td>
                <td className="py-3 px-4 font-bold text-[#0B6EFD]">$25</td>
                <td className="py-3 px-4"><span className="text-emerald-600 font-semibold">● Ready</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold">AMB-CHI-102</td>
                <td className="py-3 px-4 font-semibold">Ford Transit 250 Life Support</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">ICU</span></td>
                <td className="py-3 px-4 text-[#6B7785]">Chicago Downtown</td>
                <td className="py-3 px-4 font-bold text-[#0B6EFD]">$20</td>
                <td className="py-3 px-4"><span className="text-emerald-600 font-semibold">● Ready</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold">AMB-CHI-103</td>
                <td className="py-3 px-4 font-semibold">Chevrolet Express 3500 Dual A/C</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold text-[10px]">A/C</span></td>
                <td className="py-3 px-4 text-[#6B7785]">North Chicago</td>
                <td className="py-3 px-4 font-bold text-[#0B6EFD]">$15</td>
                <td className="py-3 px-4"><span className="text-emerald-600 font-semibold">● Ready</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
