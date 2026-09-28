import React, { useState, useEffect } from 'react';
import { X, Sprout, Loader2, Save } from 'lucide-react';
import ProductFormFields from './ProductFormFields';

/**
 * FarmerProductModal (Phase 4.13 — Refactored Phase 5.1)
 * Modal form for creating a new harvest listing or editing an existing one.
 * Form field rendering delegated to ProductFormFields for SRP compliance.
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
    name: '', category_id: '', price: '', unit: 'kg',
    stock_quantity: '10', availability: 'available', image: '', description: '',
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
        name: '', category_id: categories.length > 0 ? String(categories[0].id) : '',
        price: '', unit: 'kg', stock_quantity: '15',
        availability: 'available', image: '', description: '',
      });
    }
    setValidationError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setValidationError('Please enter a produce name.'); return; }
    if (!formData.category_id) { setValidationError('Please select a category.'); return; }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) { setValidationError('Please provide a valid non-negative price.'); return; }
    const stockNum = parseFloat(formData.stock_quantity);
    if (isNaN(stockNum) || stockNum < 0) { setValidationError('Please provide a valid stock quantity.'); return; }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E2E8DF] space-y-5 my-8 relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">{isEditing ? 'Edit Produce Item' : 'Add New Harvest Produce'}</h3>
              <p className="text-xs text-[#475569]">{isEditing ? 'Update price, availability, or harvest quota' : 'List fresh crop in your market stall catalog'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">{validationError}</div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductFormFields formData={formData} setFormData={setFormData} categories={categories} />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8DF]">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
              ) : (
                <><Save className="w-4 h-4" /><span>{isEditing ? 'Save Changes' : 'Create Listing'}</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
