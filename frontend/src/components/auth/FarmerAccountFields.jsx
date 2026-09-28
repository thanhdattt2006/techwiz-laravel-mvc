import React from 'react';
import { User, Mail, Phone, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function FarmerAccountFields({
  farmerData,
  onInputChange,
  showPassword,
  onTogglePassword,
}) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wider pb-1 border-b border-[#E2E8DF]">
        1. Producer Account Credentials
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Your Full Legal Name <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type="text"
              required
              placeholder="e.g. Arthur Pendelton"
              value={farmerData.fullname}
              onChange={(e) => onInputChange('fullname', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Username <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <span className="text-[#475569] absolute left-3 top-2 text-xs font-medium">@</span>
            <input
              type="text"
              required
              placeholder="arthur_organic"
              value={farmerData.username}
              onChange={(e) => onInputChange('username', e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Email Address <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type="email"
              required
              placeholder="arthur@prairieorganic.com"
              value={farmerData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Mobile Phone Number <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type="tel"
              required
              placeholder="(312) 555-4421"
              value={farmerData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[#0F172A]">
              Password <span className="text-[#DC2626]">*</span>
            </label>
            <span className="text-[10px] text-[#475569]">Min. 8 characters</span>
          </div>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={farmerData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-2.5 top-2 text-[#475569] hover:text-[#0F172A] transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Confirm Password <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={farmerData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
