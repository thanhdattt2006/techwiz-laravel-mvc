import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { ProfileInfoForm, ProfileSecurityForm } from '../../components/customer';

/**
 * CustomerProfilePage (Phase 4.11)
 * Clean, production-ready profile management container strictly following S.O.L.I.D & D.R.Y:
 * - Update personal details (fullname, phone, address) via ProfileInfoForm
 * - Update account credentials via ProfileSecurityForm
 * - LocalStorage mock preferences & demo fill completely removed.
 */
export default function CustomerProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Shopper Profile & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Account Credentials & Details
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Manage your personal profile, pickup contact info, and password authentication.
          </p>
        </div>

        <div className="self-start sm:self-center">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Active Account</span>
          </span>
        </div>
      </div>

      {/* Modular Form Cards */}
      <div className="grid grid-cols-1 gap-8">
        <ProfileInfoForm />
        <ProfileSecurityForm />
      </div>
    </div>
  );
}
