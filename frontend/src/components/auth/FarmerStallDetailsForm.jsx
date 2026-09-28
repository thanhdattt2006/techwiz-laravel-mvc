import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * FarmerStallDetailsForm
 * Section 2 of the farmer registration form: Farm stall operations & details.
 */
export default function FarmerStallDetailsForm({ farmerData, onInputChange }) {
  return (
    <div className="space-y-3 pt-2">
      <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wider pb-1 border-b border-[#E2E8DF]">
        2. Farm Stall Operations & Details
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Farm / Stall Trade Name <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Prairie Organic Grove"
            value={farmerData.stall_name}
            onChange={(e) => onInputChange('stall_name', e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Stall Contact Person <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Arthur Pendelton"
            value={farmerData.contact_person}
            onChange={(e) => onInputChange('contact_person', e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Stall Hotline / Direct Contact Phone <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. (312) 555-4421"
            value={farmerData.contact_phone}
            onChange={(e) => onInputChange('contact_phone', e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Farm Location / Main Address <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type="text"
              required
              placeholder="e.g. Rural Route 4, Woodstock, IL 60098"
              value={farmerData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Agricultural Specialties & Farm Bio (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Certified organic heirloom tomatoes, seasonal root vegetables, and fresh berries."
            value={farmerData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
          />
        </div>
      </div>
    </div>
  );
}
