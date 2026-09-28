import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

/**
 * AdminAnnouncementModal (Phase 4.16)
 * Modal form for broadcasting platform notices to shoppers and farmers.
 */
export default function AdminAnnouncementModal({ isOpen, onClose, onSubmit, announcement = null, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_role: 'all',
    is_active: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        target_role: announcement.target_role || 'all',
        is_active: announcement.is_active !== undefined ? Boolean(announcement.is_active) : true,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        target_role: 'all',
        is_active: true,
      });
    }
    setError(null);
  }, [announcement, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please provide announcement title and content.');
      return;
    }
    const res = await onSubmit(formData);
    if (!res?.success) {
      setError(res?.error || 'Failed to publish announcement.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E2E8DF] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0F172A]">
                {announcement ? 'Edit Announcement' : 'Publish Announcement'}
              </h2>
              <p className="text-xs text-[#475569]">Broadcast platform banner and bulletin alert</p>
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
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Winter Market Schedule Adjustment"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Target Audience</label>
            <select
              value={formData.target_role}
              onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden bg-white"
            >
              <option value="all">All Community (Everyone)</option>
              <option value="farmer">Farmers & Stall Vendors Only</option>
              <option value="customer">Shoppers & Customers Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Message Content *</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed notification message text..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ann-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded-md text-[#16A34A] focus:ring-[#16A34A] border-slate-300"
            />
            <label htmlFor="ann-active" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Active Broadcast (Visible on Banner)
            </label>
          </div>

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
              {loading ? 'Publishing...' : announcement ? 'Update Notice' : 'Broadcast Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
