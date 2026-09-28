import React, { useState } from 'react';
import { Store, Tag, PlusCircle, Edit2, Trash2, MapPin } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import AdminMarketModal from './AdminMarketModal';
import AdminCategoriesTab from './AdminCategoriesTab';

/**
 * AdminMarketsTab (Phase 4.16)
 * Complete management table for Market Venues and Produce Categories CRUD.
 */
export default function AdminMarketsTab({ marketHook, categoryHook }) {
  const { showConfirm, showAlert } = useModal();
  const [section, setSection] = useState('MARKETS'); // 'MARKETS' | 'CATEGORIES'

  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);

  const { markets, loading, actionLoading, createMarket, updateMarket, deleteMarket } = marketHook;

  const handleDeleteMarket = async (m) => {
    const confirmed = await showConfirm({
      title: 'Deactivate Farmers Market?',
      message: `Are you sure you want to deactivate "${m.name}"? Active vendors will no longer receive pre-orders for this venue.`,
      confirmText: 'Deactivate',
      type: 'danger',
    });
    if (confirmed) {
      const res = await deleteMarket(m.id);
      if (!res.success) {
        showAlert({ title: 'Error', message: res.error, type: 'danger' });
      }
    }
  };

  const handleSaveMarket = async (payload) => {
    if (editingMarket) {
      return updateMarket(editingMarket.id, payload);
    }
    return createMarket(payload);
  };

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSection('MARKETS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                section === 'MARKETS' ? 'bg-[#16A34A] text-white shadow-xs' : 'bg-slate-100 text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Market Venues ({markets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSection('CATEGORIES')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                section === 'CATEGORIES' ? 'bg-[#16A34A] text-white shadow-xs' : 'bg-slate-100 text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Produce Categories ({categoryHook.categories.length})</span>
            </button>
          </div>
          <p className="text-xs text-[#475569]">
            {section === 'MARKETS'
              ? 'Oversee authorized farmers market sites and operating hours.'
              : 'Classify local harvest categories for search & filtering.'}
          </p>
        </div>

        {section === 'MARKETS' && (
          <button
            type="button"
            onClick={() => { setEditingMarket(null); setIsMarketModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Market</span>
          </button>
        )}
      </div>

      {/* Markets Section */}
      {section === 'MARKETS' ? (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading markets...</div>
          ) : markets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No market venues found.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
                <tr>
                  <th className="py-3 px-4">Market Venue</th>
                  <th className="py-3 px-4">Schedules</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8DF]">
                {markets.map((m) => (
                  <tr key={m.id} className="hover:bg-[#F8FAF6]/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>{m.name}</span>
                      </div>
                      <div className="text-[11px] text-[#475569] pl-5">{m.address}</div>
                    </td>
                    <td className="py-3 px-4">
                      {m.schedules && m.schedules.length > 0 ? (
                        <div className="space-y-0.5">
                          {m.schedules.map((s, idx) => (
                            <div key={idx} className="text-[11px] text-slate-600 font-mono">
                              Day {s.day_of_week}: {s.open_time?.substring(0, 5)} - {s.close_time?.substring(0, 5)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No schedule set</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        m.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingMarket(m); setIsMarketModalOpen(true); }}
                          className="p-1.5 text-slate-500 hover:text-[#16A34A] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMarket(m)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <AdminCategoriesTab categoryHook={categoryHook} />
      )}

      {/* Market Modal */}
      <AdminMarketModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
        onSubmit={handleSaveMarket}
        market={editingMarket}
        loading={actionLoading}
      />
    </div>
  );
}
