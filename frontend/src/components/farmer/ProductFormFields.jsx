import React from 'react';

const COMMON_UNITS = ['kg', 'bundle', 'box', 'item', 'bag', 'bunch', 'lb', 'oz'];

export const CATEGORY_IMAGE_PRESETS = [
  { value: '/images/categories/fresh-vegetables.webp', label: 'Fresh Vegetables (/images/categories/fresh-vegetables.webp)' },
  { value: '/images/categories/orchard-fruits.webp', label: 'Orchard Fruits (/images/categories/orchard-fruits.webp)' },
  { value: '/images/categories/farm-dairy-eggs.webp', label: 'Farm Dairy & Eggs (/images/categories/farm-dairy-eggs.webp)' },
  { value: '/images/categories/artisan-bakery.webp', label: 'Artisan Bakery (/images/categories/artisan-bakery.webp)' },
  { value: '/images/categories/pantry-honey.webp', label: 'Pantry & Raw Honey (/images/categories/pantry-honey.webp)' },
];

/**
 * ProductFormFields
 * Form field groups for creating/editing a produce listing in the farmer dashboard.
 * Extracted from FarmerProductModal for SRP compliance.
 */
export default function ProductFormFields({ formData, setFormData, categories }) {
  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    updateField('category_id', catId);

    const selectedCat = categories.find((c) => String(c.id) === String(catId));
    if (selectedCat?.slug) {
      const matched = CATEGORY_IMAGE_PRESETS.find((opt) => opt.value.includes(selectedCat.slug));
      if (matched) {
        updateField('image', matched.value);
      }
    }
  };

  const isCustomUrl = Boolean(formData.image && !CATEGORY_IMAGE_PRESETS.some((p) => p.value === formData.image));

  return (
    <div className="space-y-4">
      {/* Name & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="produce-name-input" className="text-xs font-bold text-[#0F172A]">Produce Name *</label>
          <input id="produce-name-input" type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. Organic Heirloom Tomatoes" className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="produce-category-select" className="text-xs font-bold text-[#0F172A]">Category *</label>
          <select id="produce-category-select" value={formData.category_id} onChange={handleCategoryChange} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" required>
            <option value="">Select Category</option>
            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>
      </div>

      {/* Price, Unit & Stock */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="produce-price-input" className="text-xs font-bold text-[#0F172A]">Price (USD) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input id="produce-price-input" type="number" step="0.01" min="0" value={formData.price} onChange={(e) => updateField('price', e.target.value)} placeholder="4.50" className="w-full pl-6 pr-2.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-mono font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="produce-unit-select" className="text-xs font-bold text-[#0F172A]">Unit *</label>
          <select id="produce-unit-select" value={formData.unit} onChange={(e) => updateField('unit', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden">
            {COMMON_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="produce-stock-input" className="text-xs font-bold text-[#0F172A]">Stock Qty *</label>
          <input id="produce-stock-input" type="number" step="0.5" min="0" value={formData.stock_quantity} onChange={(e) => updateField('stock_quantity', e.target.value)} placeholder="20" className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-mono font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" required />
        </div>
      </div>

      {/* Availability & Image Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="produce-avail-select" className="text-xs font-bold text-[#0F172A]">Availability Status</label>
          <select id="produce-avail-select" value={formData.availability} onChange={(e) => updateField('availability', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden">
            <option value="available">Available (Open for pre-orders)</option>
            <option value="sold_out">Sold Out (Temporarily depleted)</option>
            <option value="unavailable">Unavailable (Off-season)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="produce-image-select" className="text-xs font-bold text-[#0F172A]">Produce Image (Category Preset)</label>
          <div className="flex items-center gap-2">
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-9 h-9 rounded-lg object-cover border border-[#E2E8DF] shrink-0 bg-slate-100"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <select
              id="produce-image-select"
              value={isCustomUrl ? 'custom' : (formData.image || '')}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  updateField('image', 'https://');
                } else {
                  updateField('image', e.target.value);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            >
              <option value="">-- Auto based on Category --</option>
              {CATEGORY_IMAGE_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
              <option value="custom">Custom External URL...</option>
            </select>
          </div>
          {isCustomUrl && (
            <input
              type="text"
              value={formData.image}
              onChange={(e) => updateField('image', e.target.value)}
              placeholder="Enter custom image path or URL..."
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
            />
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="produce-desc-input" className="text-xs font-bold text-[#0F172A]">Produce Description / Harvest Notes</label>
        <textarea id="produce-desc-input" rows={2} value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Freshly harvested dawn pick, certified pesticide-free..." className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden resize-none" />
      </div>
    </div>
  );
}
