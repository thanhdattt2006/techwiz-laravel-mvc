import React from 'react';
import { Store, Sprout, User, Phone, Clock, Save } from 'lucide-react';

/**
 * FarmerIdentityForm
 * Farm and Stall Master public branding, emergency contacts, operating schedule,
 * and pre-order operational automation rules.
 */
export default function FarmerIdentityForm({
  farmSettings,
  setFarmSettings,
  onSubmit,
  loading = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
        <div className="flex items-center gap-2.5">
          <Store className="w-5 h-5 text-[#16A34A]" />
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Farm & Stall Master Identity</h2>
            <p className="text-[11px] text-[#475569]">
              Public information displayed on your stall banner and customer pickup slips
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#16A34A] font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 uppercase">
          ROLE: STALL MASTER
        </span>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="farm-name-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Farm / Brand Name</span>
          </label>
          <input
            id="farm-name-input"
            type="text"
            value={farmSettings.farmName}
            onChange={(e) => setFarmSettings({ ...farmSettings, farmName: e.target.value })}
            placeholder="e.g. Prairie Organic Grove"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="farmer-name-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Lead Grower / Stall Master Name</span>
          </label>
          <input
            id="farmer-name-input"
            type="text"
            value={farmSettings.farmerName}
            onChange={(e) => setFarmSettings({ ...farmSettings, farmerName: e.target.value })}
            placeholder="e.g. Marcus Jenkins"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="farmer-phone-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Emergency Stall Hotline Phone</span>
          </label>
          <input
            id="farmer-phone-input"
            type="tel"
            value={farmSettings.phone}
            onChange={(e) => setFarmSettings({ ...farmSettings, phone: e.target.value })}
            placeholder="(312) 555-4421"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="market-assigned-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Assigned Market & Stall Number</span>
          </label>
          <input
            id="market-assigned-input"
            type="text"
            value={farmSettings.marketAssigned}
            onChange={(e) => setFarmSettings({ ...farmSettings, marketAssigned: e.target.value })}
            placeholder="e.g. Green City Market • Stall #04"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="operating-hours-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Weekend Stall Operating Hours</span>
          </label>
          <input
            id="operating-hours-input"
            type="text"
            value={farmSettings.operatingHours}
            onChange={(e) => setFarmSettings({ ...farmSettings, operatingHours: e.target.value })}
            placeholder="Saturdays: 07:00 AM – 01:00 PM"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>
      </div>

      {/* Operational Preferences */}
      <div className="pt-4 border-t border-[#E2E8DF] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Stall Pre-Order Automation</h3>

        <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
          <input
            type="checkbox"
            checked={farmSettings.autoAcceptPreOrders}
            onChange={(e) => setFarmSettings({ ...farmSettings, autoAcceptPreOrders: e.target.checked })}
            className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-bold text-[#0F172A]">Auto-Confirm Valid Reservation Requests</span>
            <p className="text-[#475569] text-[11px] mt-0.5">Automatically mark incoming orders as "Accepted" if stock is available.</p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
          <input
            type="checkbox"
            checked={farmSettings.notifyFridayCutoff}
            onChange={(e) => setFarmSettings({ ...farmSettings, notifyFridayCutoff: e.target.checked })}
            className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-bold text-[#0F172A]">Enforce Friday 6:00 PM Harvest Cutoff</span>
            <p className="text-[#475569] text-[11px] mt-0.5">Locks catalog modifications after picking begins so crate quantities stay accurate.</p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
          <input
            type="checkbox"
            checked={farmSettings.notifyShopperCrateReady}
            onChange={(e) => setFarmSettings({ ...farmSettings, notifyShopperCrateReady: e.target.checked })}
            className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-bold text-[#0F172A]">Automated Notification When Crate is Ready</span>
            <p className="text-[#475569] text-[11px] mt-0.5">Alerts customer when order status transitions to "Ready for Pickup".</p>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Stall Settings'}</span>
        </button>
      </div>
    </form>
  );
}
