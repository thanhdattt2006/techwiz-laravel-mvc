import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import marketsData from '../../data/markets.json';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Store,
  Sprout,
  Bell,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = 'marketlink_shopper_profile';

const DEFAULT_PROFILE = {
  preferredMarketId: 'mkt-02', // Green City Market
  consumptionFrequency: 'Weekly Farm Share',
  dietaryPreferences: ['100% USDA Organic Certified', 'Non-GMO Heirloom Seeds', 'Locally Grown within 50 Miles'],
  customNotes: 'Prefer morning harvest batch. Bring recyclable cloth tote bags for pickup.',
  phoneForStallMaster: '(312) 555-7821',
  neighborhood: 'Lincoln Park, Chicago',
  notifySms2HoursBefore: true,
  notifyFridayHarvestBulletin: true,
  notifySpecialStallDiscounts: false,
};

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const { showAlert, showConfirm } = useModal();

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (savedSuccess) {
      const timer = setTimeout(() => setSavedSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedSuccess]);

  const handleToggleDietary = (pref) => {
    setProfile((prev) => {
      const exists = prev.dietaryPreferences.includes(pref);
      const updated = exists
        ? prev.dietaryPreferences.filter((p) => p !== pref)
        : [...prev.dietaryPreferences, pref];
      return { ...prev, dietaryPreferences: updated };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSavedSuccess(true);
      showAlert({
        title: 'Profile Updated',
        message: 'Your shopper preferences, preferred market, and SMS stall alert settings have been saved successfully.',
        type: 'success',
        confirmText: false,
        autoCloseMs: 2000,
      });
    } catch {
      showAlert({
        title: 'Storage Error',
        message: 'Unable to save profile preferences to local storage.',
        type: 'danger',
      });
    }
  };

  const handleReset = async () => {
    const confirmed = await showConfirm({
      title: 'Reset Preferences?',
      message: 'Restore default MarketLink shopper profile settings?',
      type: 'warning',
      confirmText: 'Yes, Reset',
      cancelText: 'Cancel',
    });
    if (confirmed) {
      setProfile(DEFAULT_PROFILE);
      localStorage.removeItem(STORAGE_KEY);
      showAlert({
        title: 'Restored Defaults',
        message: 'Profile reset to standard Chicago community shopper defaults.',
        type: 'info',
        confirmText: false,
        autoCloseMs: 1800,
      });
    }
  };

  const handleDemoFill = () => {
    setProfile({
      preferredMarketId: 'mkt-01',
      consumptionFrequency: 'Twice Weekly (Wed & Sat)',
      dietaryPreferences: [
        '100% USDA Organic Certified',
        'Non-GMO Heirloom Seeds',
        'Locally Grown within 50 Miles',
        'Pasture-Raised & Grass-Fed Dairy',
        'Vegan & Plant-Based Harvest',
      ],
      customNotes: 'Always pick firm heirloom tomatoes. Call if stall moves due to rain.',
      phoneForStallMaster: '(312) 555-9088',
      neighborhood: 'Lincoln Park & Old Town, Chicago',
      notifySms2HoursBefore: true,
      notifyFridayHarvestBulletin: true,
      notifySpecialStallDiscounts: true,
    });
    showAlert({
      title: 'Demo Profile Loaded',
      message: 'Populated with certified organic enthusiast shopper preferences for testing!',
      type: 'success',
      confirmText: false,
      autoCloseMs: 1600,
    });
  };

  const DIETARY_OPTIONS = [
    '100% USDA Organic Certified',
    'Non-GMO Heirloom Seeds',
    'Locally Grown within 50 Miles',
    'Pasture-Raised & Grass-Fed Dairy',
    'Tree-Ripened Orchard Fruit',
    'Vegan & Plant-Based Harvest',
    'Artisanal Wood-Fired Bakery',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Shopper Profile & Farm Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Fresh Produce & Market Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Configure your home market, dietary standards, and pickup notification channels so growers can pack your tote exactly to your liking.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleDemoFill}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>1-Click Demo Fill</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Primary Market & Household Consumption */}
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8DF]">
            <Store className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-base font-bold text-[#0F172A]">Home Farmers Market & Routine</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="preferred-market-select" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Preferred Local Market</span>
              </label>
              <select
                id="preferred-market-select"
                value={profile.preferredMarketId}
                onChange={(e) => setProfile({ ...profile, preferredMarketId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
              >
                {marketsData.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.neighborhood}) • {m.operatingDays}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#475569]">
                This market will be selected by default when placing weekend pre-orders.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="consumption-frequency-select" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Household Produce Routine</span>
              </label>
              <select
                id="consumption-frequency-select"
                value={profile.consumptionFrequency}
                onChange={(e) => setProfile({ ...profile, consumptionFrequency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="Weekly Farm Share">Weekly Farm Share (Regular Saturday shopper)</option>
                <option value="Twice Weekly (Wed & Sat)">Twice Weekly (Midweek greens & Weekend batch)</option>
                <option value="Bi-Weekly Harvest">Bi-Weekly (Every 2 weeks)</option>
                <option value="Seasonal Occasional">Seasonal Special Occasions Only</option>
              </select>
              <p className="text-[11px] text-[#475569]">
                Helps growers forecast planting quotas and harvest volume for your neighborhood.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Dietary Standards & Quality Certifications */}
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8DF]">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-base font-bold text-[#0F172A]">Dietary Standards & Produce Filters</h2>
          </div>

          <p className="text-xs text-[#475569]">
            Select quality standards you prefer. Items meeting these standards will be highlighted with priority badges in your catalog view.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIETARY_OPTIONS.map((opt) => {
              const checked = profile.dietaryPreferences.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleToggleDietary(opt)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition text-left cursor-pointer ${
                    checked
                      ? 'bg-emerald-50 text-[#16A34A] border-emerald-300 shadow-2xs'
                      : 'bg-white text-[#475569] border-[#E2E8DF] hover:bg-[#F8FAF6]'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                      checked
                        ? 'bg-[#16A34A] border-[#16A34A] text-white'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Stall Master Contact & Pickup Notes */}
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8DF]">
            <User className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-base font-bold text-[#0F172A]">Stall Master Inspection Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="shopper-full-name-input" className="text-xs font-bold text-[#0F172A]">Shopper Full Name</label>
              <input
                id="shopper-full-name-input"
                type="text"
                readOnly
                value={user?.fullname || 'Certified Shopper'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-slate-100 text-xs font-semibold text-[#475569] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#475569]">
                Linked directly to your MarketLink authentication profile.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="stall-master-phone-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Phone for Stall Master (Pickup Label)</span>
              </label>
              <input
                id="stall-master-phone-input"
                type="text"
                value={profile.phoneForStallMaster}
                onChange={(e) => setProfile({ ...profile, phoneForStallMaster: e.target.value })}
                placeholder="(312) 555-0199"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
              />
              <p className="text-[11px] text-[#475569]">
                Printed on your tote reservation tag so the farmer can identify you quickly.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="neighborhood-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Chicago Neighborhood</span>
              </label>
              <input
                id="neighborhood-input"
                type="text"
                value={profile.neighborhood}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                placeholder="Lincoln Park, Lakeview, Logan Square..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="shopper-email-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Registered Email</span>
              </label>
              <input
                id="shopper-email-input"
                type="email"
                readOnly
                value={user?.email || 'shopper@marketlink.org'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-slate-100 text-xs font-semibold text-[#475569] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label htmlFor="custom-notes-textarea" className="text-xs font-bold text-[#0F172A]">
              Special Produce Packing Instructions (Optional)
            </label>
            <textarea
              id="custom-notes-textarea"
              rows={3}
              value={profile.customNotes}
              onChange={(e) => setProfile({ ...profile, customNotes: e.target.value })}
              placeholder="e.g. Please choose slightly greener bananas, avoid plastic wrap, bring cloth bag..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>
        </div>

        {/* 4. Notification & Alert Channels */}
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8DF]">
            <Bell className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-base font-bold text-[#0F172A]">Market Reminders & SMS Alerts</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
              <input
                type="checkbox"
                checked={profile.notifySms2HoursBefore}
                onChange={(e) => setProfile({ ...profile, notifySms2HoursBefore: e.target.checked })}
                className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-[#0F172A]">SMS Reminder 2 Hours Before Market Closes</span>
                <p className="text-[#475569] text-[11px] mt-0.5">
                  Sends a polite SMS alert to your phone if you have uncollected pre-orders awaiting at the stall.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
              <input
                type="checkbox"
                checked={profile.notifyFridayHarvestBulletin}
                onChange={(e) => setProfile({ ...profile, notifyFridayHarvestBulletin: e.target.checked })}
                className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-[#0F172A]">Friday Dawn Harvest Bulletin (Email)</span>
                <p className="text-[#475569] text-[11px] mt-0.5">
                  Preview seasonal crops harvested at dawn before Saturday morning market doors open.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
              <input
                type="checkbox"
                checked={profile.notifySpecialStallDiscounts}
                onChange={(e) => setProfile({ ...profile, notifySpecialStallDiscounts: e.target.checked })}
                className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-[#0F172A]">End-of-Market Surplus Flash Sales</span>
                <p className="text-[#475569] text-[11px] mt-0.5">
                  Alerts for discounted bulk baskets from family farms looking to clear surplus produce.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Shopper Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
