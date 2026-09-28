import React, { useState } from 'react';
import { Bell, PlusCircle, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import AdminAnnouncementModal from './AdminAnnouncementModal';

/**
 * AdminAnnouncementsTab (Phase 4.16)
 * Platform announcements manager for site-wide banners and role-targeted notices.
 */
export default function AdminAnnouncementsTab({ announcementHook }) {
  const { showConfirm, showAlert } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const {
    announcements,
    loading,
    actionLoading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleActiveAnnouncement,
  } = announcementHook;

  const handleDelete = async (item) => {
    const confirmed = await showConfirm({
      title: 'Delete Announcement?',
      message: `Are you sure you want to remove "${item.title}"?`,
      confirmText: 'Delete',
      type: 'danger',
    });
    if (confirmed) {
      const res = await deleteAnnouncement(item.id);
      if (!res.success) {
        showAlert({ title: 'Error', message: res.error, type: 'danger' });
      }
    }
  };

  const handleToggleActive = async (item) => {
    const res = await toggleActiveAnnouncement(item.id, item.is_active);
    if (!res.success) {
      showAlert({ title: 'Error', message: res.error, type: 'danger' });
    }
  };

  const handleSave = async (payload) => {
    if (editingItem) {
      return updateAnnouncement(editingItem.id, payload);
    }
    return createAnnouncement(payload);
  };

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Platform Announcements & Banners</h2>
          <p className="text-xs text-[#475569]">
            Broadcast emergency alerts, weather notifications, and market updates to shoppers and growers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Broadcast Notice</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No platform announcements created yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
              <tr>
                <th className="py-3 px-4">Title & Notice</th>
                <th className="py-3 px-4">Target Audience</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8DF]">
              {announcements.map((a) => {
                const isActive = Boolean(a.is_active);
                const roleBadge =
                  a.target_role === 'farmer'
                    ? { label: 'Farmers Only', cls: 'bg-amber-100 text-amber-800' }
                    : a.target_role === 'customer'
                    ? { label: 'Shoppers Only', cls: 'bg-blue-100 text-blue-800' }
                    : { label: 'All Users', cls: 'bg-purple-100 text-purple-800' };

                return (
                  <tr key={a.id} className="hover:bg-[#F8FAF6]/60 transition">
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>{a.title}</span>
                      </div>
                      <p className="text-[11px] text-[#475569] line-clamp-2 pl-5 mt-0.5">{a.content}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${roleBadge.cls}`}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleToggleActive(a)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border ${
                          isActive
                            ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingItem(a); setIsModalOpen(true); }}
                          className="p-1.5 text-slate-500 hover:text-[#16A34A] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(a)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AdminAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        announcement={editingItem}
        loading={actionLoading}
      />
    </div>
  );
}
