import React from 'react';
import { Store, PlusCircle, Edit2, Trash2 } from 'lucide-react';

/**
 * AdminMarketsTab
 * Markets manager table and registration triggers (Pre-Phase 4.16 modularization).
 */
export default function AdminMarketsTab({
  marketsList = [],
  onOpenAddModal,
  onOpenEditModal,
  onDeleteMarket,
}) {
  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Chicago Farmers Markets Directory</h2>
          <p className="text-xs text-[#475569]">
            Manage authorized market venues, operating days, and stall capacity allocations.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Market</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
            <tr>
              <th className="py-3 px-4">Market Venue</th>
              <th className="py-3 px-4">Operating Schedule</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Primary Produce Focus</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8DF]">
            {marketsList.map((m) => (
              <tr key={m.id} className="hover:bg-[#F8FAF6]/60 transition">
                <td className="py-3 px-4">
                  <div className="font-bold text-[#0F172A]">{m.name}</div>
                  <div className="text-[11px] text-[#475569]">{m.address || m.neighborhood}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-[#0F172A]">{m.operatingDays || 'Saturdays'}</div>
                  <div className="text-[11px] text-[#475569] font-mono">{m.operatingHours || '07:00 AM – 01:00 PM'}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-[#16A34A]">{m.stallsCount || 30}</span>
                  <span className="text-slate-400 text-[11px]"> stalls</span>
                </td>
                <td className="py-3 px-4 text-[#475569] max-w-xs truncate">
                  {m.specialty || 'Fresh local harvest & greens'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(m)}
                      className="p-1.5 text-slate-500 hover:text-[#16A34A] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit market details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteMarket(m.id, m.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Deactivate market"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
