import React from 'react';

const COMMON_UNITS = ['kg', 'bundle', 'box', 'item', 'bag', 'bunch', 'lb', 'oz'];

/**
 * ProductFormFields
 * Form field groups for creating/editing a produce listing in the farmer dashboard.
 * Extracted from FarmerProductModal for SRP compliance.
 */
export default function ProductFormFields({ formData, setFormData, categories }) {
  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

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
          <select id="produce-category-select" value={formData.category_id} onChange={(e) => updateField('category_id', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" required>
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

      {/* Availability & Image URL */}
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
          <label htmlFor="produce-image-input" className="text-xs font-bold text-[#0F172A]">Image URL (Optional)</label>
          <input id="produce-image-input" type="url" value={formData.image} onChange={(e) => updateField('image', e.target.value)} placeholder="https://..." className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" />
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
