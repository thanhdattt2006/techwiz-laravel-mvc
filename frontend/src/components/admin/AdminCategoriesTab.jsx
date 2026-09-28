import React, { useState } from 'react';
import { Tag, PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import AdminCategoryModal from './AdminCategoryModal';

/**
 * AdminCategoriesTab (Phase 4.16)
 * Produce Categories management table and CRUD triggers.
 */
export default function AdminCategoriesTab({ categoryHook }) {
  const { showConfirm, showAlert } = useModal();
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { categories, loading, actionLoading, createCategory, updateCategory, deleteCategory } = categoryHook;

  const handleDelete = async (cat) => {
    const confirmed = await showConfirm({
      title: 'Delete Produce Category?',
      message: `Are you sure you want to delete "${cat.name}"? Categories with active products cannot be deleted.`,
      confirmText: 'Delete',
      type: 'danger',
    });
    if (confirmed) {
      const res = await deleteCategory(cat.id);
      if (!res.success) {
        showAlert({ title: 'Cannot Delete Category', message: res.error, type: 'danger' });
      }
    }
  };

  const handleSave = async (payload) => {
    if (editingCategory) {
      return updateCategory(editingCategory.id, payload);
    }
    return createCategory(payload);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">No categories found.</div>
      ) : (
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAF6] border-b border-[#E2E8DF] text-[11px] font-bold text-[#475569] uppercase">
            <tr>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8DF]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8FAF6]/60 transition">
                <td className="py-3 px-4">
                  <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{c.name}</span>
                  </div>
                  <div className="text-[11px] text-[#475569] pl-5 max-w-xs truncate">{c.description || 'No description'}</div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{c.slug}</td>
                <td className="py-3 px-4">
                  <span className="font-bold text-[#16A34A]">{c.products_count ?? 0}</span> items
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => { setEditingCategory(c); setIsCatModalOpen(true); }}
                      className="p-1.5 text-slate-500 hover:text-[#16A34A] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete category"
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

      <AdminCategoryModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        onSubmit={handleSave}
        category={editingCategory}
        loading={actionLoading}
      />
    </div>
  );
}
