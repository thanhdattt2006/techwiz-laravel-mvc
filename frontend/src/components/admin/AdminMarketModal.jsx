import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import MarketScheduleEditor from './MarketScheduleEditor';

/**
 * AdminMarketModal (Phase 4.16)
 * Modal form for creating and updating Farmers Market venues and schedules.
 */
export default function AdminMarketModal({ isOpen, onClose, onSubmit, market = null, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    description: '',
    image: '',
    status: 'active',
  });
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (market) {
      setFormData({
        name: market.name || '',
        address: market.address || '',
        latitude: market.latitude || '',
        longitude: market.longitude || '',
        description: market.description || '',
        image: market.image || '',
        status: market.status || 'active',
      });
      setSchedules(
        market.schedules && market.schedules.length > 0
          ? market.schedules.map((s) => ({
              day_of_week: Number(s.day_of_week),
              open_time: s.open_time?.substring(0, 5) || '07:00',
              close_time: s.close_time?.substring(0, 5) || '13:00',
            }))
          : [{ day_of_week: 6, open_time: '07:00', close_time: '13:00' }]
      );
    } else {
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        description: '',
        image: '',
        status: 'active',
      });
      setSchedules([{ day_of_week: 6, open_time: '07:00', close_time: '13:00' }]);
    }
    setError(null);
  }, [market, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Please provide market venue name and address.');
      return;
    }
    const payload = {
      ...formData,
      latitude: formData.latitude ? Number(formData.latitude) : 41.8781,
      longitude: formData.longitude ? Number(formData.longitude) : -87.6298,
      schedules: schedules.map((s) => ({
        day_of_week: Number(s.day_of_week),
        open_time: s.open_time,
        close_time: s.close_time,
      })),
    };
    const res = await onSubmit(payload);
    if (!res?.success) {
      setError(res?.error || 'Failed to save market.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E2E8DF] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0F172A]">
                {market ? 'Edit Farmers Market' : 'Create Farmers Market'}
              </h2>
              <p className="text-xs text-[#475569]">Configure community market venue & weekly schedules</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Market Venue Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Green City Market Lincoln Park"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 1817 N Clark St, Chicago, IL 60614"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="41.9152"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="-87.6341"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Community farmers market operating since 1999..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              />
            </div>
          </div>

          <MarketScheduleEditor schedules={schedules} onChange={setSchedules} />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E2E8DF] text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : market ? 'Update Venue' : 'Create Venue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
