import React, { useState, useEffect } from 'react';
import { X, Store, Save, Loader2 } from 'lucide-react';
import MarketPickupDaysPicker from './MarketPickupDaysPicker';

const SLOT_OPTIONS = [15, 20, 30, 45, 60];

/**
 * FarmerMarketModal (Phase 4.14)
 * Modal form for linking a stall to a new farmers market or editing operating schedule and slots.
 */
export default function FarmerMarketModal({
  isOpen,
  onClose,
  onSave,
  editingMarket = null,
  allMarkets = [],
  submitting = false,
}) {
  const isEditing = Boolean(editingMarket);

  const [formData, setFormData] = useState({
    market_id: '',
    stall_location: '',
    pickup_days: [6],
    pickup_start_time: '07:00',
    pickup_end_time: '13:00',
    slot_minutes: 30,
    cutoff_hours: 12,
    is_active: true,
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (editingMarket) {
      setFormData({
        market_id: editingMarket.market_id || editingMarket.market?.id || '',
        stall_location: editingMarket.stall_location || '',
        pickup_days: Array.isArray(editingMarket.pickup_days) ? editingMarket.pickup_days.map(Number) : [6],
        pickup_start_time: editingMarket.pickup_start_time?.slice(0, 5) || '07:00',
        pickup_end_time: editingMarket.pickup_end_time?.slice(0, 5) || '13:00',
        slot_minutes: Number(editingMarket.slot_minutes || 30),
        cutoff_hours: Number(editingMarket.cutoff_hours || 12),
        is_active: editingMarket.is_active !== undefined ? Boolean(editingMarket.is_active) : true,
      });
    } else {
      setFormData({
        market_id: allMarkets.length > 0 ? String(allMarkets[0].id) : '',
        stall_location: 'Stall #04',
        pickup_days: [6],
        pickup_start_time: '07:00',
        pickup_end_time: '13:00',
        slot_minutes: 30,
        cutoff_hours: 12,
        is_active: true,
      });
    }
    setValidationError('');
  }, [editingMarket, allMarkets, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (dayVal) => {
    setFormData((prev) => {
      const exists = prev.pickup_days.includes(dayVal);
      const nextDays = exists
        ? prev.pickup_days.filter((d) => d !== dayVal)
        : [...prev.pickup_days, dayVal].sort((a, b) => a - b);
      return { ...prev, pickup_days: nextDays };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing && !formData.market_id) return setValidationError('Please select a farmers market.');
    if (formData.pickup_days.length === 0) return setValidationError('Please select at least one pickup operating day.');
    if (!formData.pickup_start_time || !formData.pickup_end_time) return setValidationError('Please enter operating hours.');
    if (formData.pickup_start_time >= formData.pickup_end_time) return setValidationError('Closing time must be after opening time.');

    setValidationError('');
    onSave({
      market_id: Number(formData.market_id),
      stall_location: formData.stall_location.trim() || null,
      pickup_days: formData.pickup_days,
      pickup_start_time: formData.pickup_start_time,
      pickup_end_time: formData.pickup_end_time,
      slot_minutes: Number(formData.slot_minutes),
      cutoff_hours: Number(formData.cutoff_hours),
      is_active: Boolean(formData.is_active),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E2E8DF] space-y-4 my-8 relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {isEditing ? 'Update Stall Schedule & Slots' : 'Register Stall at Market'}
              </h3>
              <p className="text-xs text-[#475569]">Set up pickup windows and pre-order cutoff</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label htmlFor="market-select" className="text-xs font-bold text-[#0F172A]">Farmers Market *</label>
            <select
              id="market-select"
              disabled={isEditing}
              value={formData.market_id}
              onChange={(e) => setFormData({ ...formData, market_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden disabled:opacity-60"
              required
            >
              <option value="">Select a Farmers Market</option>
              {allMarkets.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.city || m.address})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="stall-location-input" className="text-xs font-bold text-[#0F172A]">Stall Location</label>
            <input
              id="stall-location-input"
              type="text"
              value={formData.stall_location}
              onChange={(e) => setFormData({ ...formData, stall_location: e.target.value })}
              placeholder="e.g. Stall #04 - South Pavilion"
              className="w-full px-3 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            />
          </div>

          <MarketPickupDaysPicker selectedDays={formData.pickup_days} onToggleDay={toggleDay} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="start-time-input" className="text-xs font-bold text-[#0F172A]">Pickup Starts</label>
              <input
                id="start-time-input"
                type="time"
                value={formData.pickup_start_time}
                onChange={(e) => setFormData({ ...formData, pickup_start_time: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-mono font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="end-time-input" className="text-xs font-bold text-[#0F172A]">Pickup Ends</label>
              <input
                id="end-time-input"
                type="time"
                value={formData.pickup_end_time}
                onChange={(e) => setFormData({ ...formData, pickup_end_time: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-mono font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="slot-duration-select" className="text-xs font-bold text-[#0F172A]">Slot Duration</label>
              <select
                id="slot-duration-select"
                value={formData.slot_minutes}
                onChange={(e) => setFormData({ ...formData, slot_minutes: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              >
                {SLOT_OPTIONS.map((min) => (
                  <option key={min} value={min}>{min} Minutes</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="cutoff-hours-input" className="text-xs font-bold text-[#0F172A]">Cutoff Notice</label>
              <div className="relative">
                <input
                  id="cutoff-hours-input"
                  type="number"
                  min="1"
                  max="72"
                  value={formData.cutoff_hours}
                  onChange={(e) => setFormData({ ...formData, cutoff_hours: Number(e.target.value) })}
                  className="w-full pl-3 pr-12 py-1.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-mono font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">Hours</span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-[#0F172A]">Stall Active For Pre-Orders</span>
            </div>
          </label>

          <div className="flex items-center gap-3 pt-2 border-t border-[#E2E8DF]">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isEditing ? 'Save Configuration' : 'Register Stall'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
