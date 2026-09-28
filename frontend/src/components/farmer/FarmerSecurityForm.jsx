import React, { useState } from 'react';
import { Lock, KeyRound, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';

/**
 * FarmerSecurityForm
 * Password update and credential management for stall masters.
 */
export default function FarmerSecurityForm() {
  const { changePassword } = useAuth();
  const { showAlert } = useModal();

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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordState.currentPassword) {
      showAlert({
        title: 'Missing Current Password',
        message: 'Please enter your current Stall Master password.',
        type: 'danger',
      });
      return;
    }
    if (!passwordState.newPassword || passwordState.newPassword.length < 6) {
      showAlert({
        title: 'Password Too Short',
        message: 'New password must be at least 6 characters long.',
        type: 'danger',
      });
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showAlert({
        title: 'Password Mismatch',
        message: 'New password and confirmation do not match.',
        type: 'danger',
      });
      return;
    }

    setLoading(true);
    const result = await changePassword({
      currentPassword: passwordState.currentPassword,
      newPassword: passwordState.newPassword,
      confirmPassword: passwordState.confirmPassword,
    });
    setLoading(false);

    if (result.success) {
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showAlert({
        title: 'Password Updated',
        message: result.message || 'Stall Master account credentials updated successfully.',
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-[#16A34A]" />
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Stall Master Security & Change Password</h2>
            <p className="text-[11px] text-[#475569]">
              Update your access credentials for market stall management
            </p>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Current Password */}
        <div className="space-y-2">
          <label htmlFor="farmer-curr-pass" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Current Password</span>
          </label>
          <div className="relative">
            <input
              id="farmer-curr-pass"
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
          <p className="text-[10px] text-slate-400">Demo account: password</p>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="farmer-new-pass" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>New Password</span>
          </label>
          <div className="relative">
            <input
              id="farmer-new-pass"
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
          <label htmlFor="farmer-confirm-pass" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Confirm New Password</span>
          </label>
          <div className="relative">
            <input
              id="farmer-confirm-pass"
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
            <p
              className={`text-[10px] font-bold ${
                passwordState.newPassword === passwordState.confirmPassword
                  ? 'text-[#16A34A]'
                  : 'text-rose-500'
              }`}
            >
              {passwordState.newPassword === passwordState.confirmPassword
                ? '✓ Passwords match'
                : '✕ Passwords do not match'}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span>{loading ? 'Updating...' : 'Update Password'}</span>
        </button>
      </div>
    </form>
  );
}
