import React, { useState } from 'react';
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
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  SlidersHorizontal,
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
  const { user, updateProfile, changePassword } = useAuth();
  const { showAlert, showConfirm } = useModal();

  const [activeTab, setActiveTab] = useState('ACCOUNT'); // 'ACCOUNT' | 'PREFERENCES'
  const [fullname, setFullname] = useState(user?.fullname || 'Elena Rostova (Local Shopper)');
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  // Password state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);


  const handleToggleDietary = (pref) => {
    setProfile((prev) => {
      const exists = prev.dietaryPreferences.includes(pref);
      const updated = exists
        ? prev.dietaryPreferences.filter((p) => p !== pref)
        : [...prev.dietaryPreferences, pref];
      return { ...prev, dietaryPreferences: updated };
    });
  };

  // 1. Save Personal Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullname.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please provide a valid full name for your shopper identity.',
        type: 'danger',
      });
      return;
    }

    setProfileLoading(true);
    await updateProfile({
      fullname: fullname.trim(),
      phone: profile.phoneForStallMaster,
      neighborhood: profile.neighborhood,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setProfileLoading(false);

    showAlert({
      title: 'Profile Updated',
      message: 'Your personal shopper identity and pickup details have been updated across MarketLink.',
      type: 'success',
      confirmText: false,
      autoCloseMs: 2000,
    });
  };

  // 2. Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordState.currentPassword) {
      showAlert({
        title: 'Missing Current Password',
        message: 'Please enter your current account password to authorize changes.',
        type: 'danger',
      });
      return;
    }

    if (!passwordState.newPassword || passwordState.newPassword.length < 6) {
      showAlert({
        title: 'Password Too Short',
        message: 'Your new password must be at least 6 characters long.',
        type: 'danger',
      });
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showAlert({
        title: 'Password Mismatch',
        message: 'The new password and confirmation password do not match.',
        type: 'danger',
      });
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword({
      currentPassword: passwordState.currentPassword,
      newPassword: passwordState.newPassword,
      confirmPassword: passwordState.confirmPassword,
    });
    setPasswordLoading(false);

    if (result.success) {
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showAlert({
        title: 'Password Changed',
        message: result.message || 'Your security credentials have been successfully updated.',
        type: 'success',
        confirmText: false,
        autoCloseMs: 2200,
      });
    } else {
      showAlert({
        title: 'Update Failed',
        message: result.message || 'Could not update password.',
        type: 'danger',
      });
    }
  };

  // 3. Reset Defaults
  const handleReset = async () => {
    const confirmed = await showConfirm({
      title: 'Reset Preferences?',
      message: 'Restore default MarketLink shopper profile and market settings?',
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
    setFullname('Elena Rostova (Certified Local Shopper)');
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
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Shopper Hub • Profile & Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Account Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Manage your personal identity, stall pickup phone label, password credentials, and produce dietary standards.
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

      {/* Primary Section Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E2E8DF] shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('ACCOUNT')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'ACCOUNT'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Info & Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PREFERENCES')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'PREFERENCES'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF6]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Market & Produce Preferences</span>
        </button>
      </div>

      {/* TAB 1: ACCOUNT & PASSWORD SETTINGS */}
      {activeTab === 'ACCOUNT' && (
        <div className="space-y-6">
          {/* 1. Personal Identity & Pickup Contact */}
          <form onSubmit={handleSaveProfile} className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-[#16A34A]" />
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Personal Profile & Stall Label</h2>
                  <p className="text-[11px] text-[#475569]">This information is used to tag your produce crates at weekend stalls</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#16A34A] font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 uppercase">
                {user?.role || 'Shopper'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="shopper-fullname-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Full Legal / Display Name</span>
                </label>
                <input
                  id="shopper-fullname-input"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                  required
                />
                <p className="text-[11px] text-[#475569]">
                  Displayed on your orders, reviews, and header navigation.
                </p>
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
                <p className="text-[11px] text-[#475569]">
                  Primary login identity managed by MarketLink authentication.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="stall-phone-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Phone for Stall Master (Pickup Label)</span>
                </label>
                <input
                  id="stall-phone-input"
                  type="tel"
                  value={profile.phoneForStallMaster}
                  onChange={(e) => setProfile({ ...profile, phoneForStallMaster: e.target.value })}
                  placeholder="(312) 555-0199"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                />
                <p className="text-[11px] text-[#475569]">
                  Printed on your pickup tag so growers can reach you if produce needs refrigeration.
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
                  placeholder="e.g. Lincoln Park, Logan Square, West Loop"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                />
                <p className="text-[11px] text-[#475569]">
                  Helps match you with closest neighborhood hub pickups.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{profileLoading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>

          {/* 2. Security & Password Change */}
          <form onSubmit={handleChangePassword} className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#16A34A]" />
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Security & Change Password</h2>
                  <p className="text-[11px] text-[#475569]">Update your account credentials to keep your shopper wallet secure</p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Current Password */}
              <div className="space-y-2">
                <label htmlFor="current-password-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Current Password</span>
                </label>
                <div className="relative">
                  <input
                    id="current-password-input"
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Demo account: password123</p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="new-password-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    id="new-password-input"
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#475569]">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirm-password-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm-password-input"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordState.confirmPassword && (
                  <p className={`text-[10px] font-bold ${passwordState.newPassword === passwordState.confirmPassword ? 'text-[#16A34A]' : 'text-rose-500'}`}>
                    {passwordState.newPassword === passwordState.confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MARKET & PRODUCE PREFERENCES */}
      {activeTab === 'PREFERENCES' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
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

          {/* 3. Special Produce Packing Instructions */}
          <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <label htmlFor="custom-notes-textarea" className="text-xs font-bold text-[#0F172A] block">
              Special Produce Packing Instructions (Optional)
            </label>
            <textarea
              id="custom-notes-textarea"
              rows={3}
              value={profile.customNotes}
              onChange={(e) => setProfile({ ...profile, customNotes: e.target.value })}
              placeholder="e.g. Please choose slightly greener bananas, avoid plastic wrap, bring cloth tote bag..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
            />
            <p className="text-[11px] text-[#475569]">
              This note is automatically attached to every pre-order tote packed by the growers.
            </p>
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
                    Receive a text alert on Saturday afternoon so you don't miss your harvest crate pickup.
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

          {/* Action Buttons */}
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
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
