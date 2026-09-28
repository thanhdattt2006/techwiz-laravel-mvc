import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';

/**
 * AdminCategoryModal (Phase 4.16)
 * Modal form for creating and updating Produce Categories.
 */
export default function AdminCategoryModal({ isOpen, onClose, onSubmit, category = null, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    is_active: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: category.image || '',
        is_active: category.is_active !== undefined ? Boolean(category.is_active) : true,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        is_active: true,
      });
    }
    setError(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !category ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a category name.');
      return;
    }
    const res = await onSubmit(formData);
    if (!res?.success) {
      setError(res?.error || 'Failed to save category.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E2E8DF] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0F172A]">
                {category ? 'Edit Category' : 'Create Category'}
              </h2>
              <p className="text-xs text-[#475569]">Manage agricultural produce classifications</p>
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
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Heirloom Vegetables"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="heirloom-vegetables"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Fresh harvested vegetables, root crops, greens..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="cat-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded-md text-[#16A34A] focus:ring-[#16A34A] border-slate-300"
            />
            <label htmlFor="cat-active" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Active in Public Catalog
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
              {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
