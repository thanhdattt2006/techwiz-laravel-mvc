import React, { useState, useEffect } from 'react';
import { X, Sprout, DollarSign, Package, Image as ImageIcon, Loader2, Save } from 'lucide-react';

const COMMON_UNITS = ['kg', 'bundle', 'box', 'item', 'bag', 'bunch', 'lb', 'oz'];

/**
 * FarmerProductModal (Phase 4.13)
 * Modal form for creating a new harvest listing or editing an existing one.
 */
export default function FarmerProductModal({
  isOpen,
  onClose,
  onSave,
  product = null,
  categories = [],
  submitting = false,
}) {
  const isEditing = Boolean(product?.id);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    unit: 'kg',
    stock_quantity: '10',
    availability: 'available',
    image: '',
    description: '',
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category_id || product.category?.id || '',
        price: product.price ? String(product.price) : '',
        unit: product.unit || 'kg',
        stock_quantity: product.stock_quantity !== undefined ? String(product.stock_quantity) : '0',
        availability: product.availability || 'available',
        image: product.image || '',
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        category_id: categories.length > 0 ? String(categories[0].id) : '',
        price: '',
        unit: 'kg',
        stock_quantity: '15',
        availability: 'available',
        image: '',
        description: '',
      });
    }
    setValidationError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setValidationError('Please enter a produce name.');
      return;
    }
    if (!formData.category_id) {
      setValidationError('Please select a category.');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setValidationError('Please provide a valid non-negative price.');
      return;
    }
    const stockNum = parseFloat(formData.stock_quantity);
    if (isNaN(stockNum) || stockNum < 0) {
      setValidationError('Please provide a valid stock quantity.');
      return;
    }

    setValidationError('');
    onSave({
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      price: priceNum,
      unit: formData.unit.trim() || 'kg',
      stock_quantity: stockNum,
      availability: formData.availability,
      image: formData.image.trim() || null,
      description: formData.description.trim() || null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E2E8DF] space-y-5 my-8 relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {isEditing ? 'Edit Produce Item' : 'Add New Harvest Produce'}
              </h3>
              <p className="text-xs text-[#475569]">
                {isEditing ? 'Update price, availability, or harvest quota' : 'List fresh crop in your market stall catalog'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {validationError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="produce-name-input" className="text-xs font-bold text-[#0F172A]">
                Produce Name *
              </label>
              <input
                id="produce-name-input"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Organic Heirloom Tomatoes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="produce-category-select" className="text-xs font-bold text-[#0F172A]">
                Category *
              </label>
              <select
                id="produce-category-select"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Unit & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="produce-price-input" className="text-xs font-bold text-[#0F172A]">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  id="produce-price-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="4.50"
                  className="w-full pl-6 pr-2.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-mono font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="produce-unit-select" className="text-xs font-bold text-[#0F172A]">
                Unit *
              </label>
              <select
                id="produce-unit-select"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="produce-stock-input" className="text-xs font-bold text-[#0F172A]">
                Stock Qty *
              </label>
              <input
                id="produce-stock-input"
                type="number"
                step="0.5"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                placeholder="20"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-mono font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Availability & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="produce-avail-select" className="text-xs font-bold text-[#0F172A]">
                Availability Status
              </label>
              <select
                id="produce-avail-select"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              >
                <option value="available">Available (Open for pre-orders)</option>
                <option value="sold_out">Sold Out (Temporarily depleted)</option>
                <option value="unavailable">Unavailable (Off-season)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="produce-image-input" className="text-xs font-bold text-[#0F172A]">
                Image URL (Optional)
              </label>
              <input
                id="produce-image-input"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="produce-desc-input" className="text-xs font-bold text-[#0F172A]">
              Produce Description / Harvest Notes
            </label>
            <textarea
              id="produce-desc-input"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Freshly harvested dawn pick, certified pesticide-free..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8DF]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Listing'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
