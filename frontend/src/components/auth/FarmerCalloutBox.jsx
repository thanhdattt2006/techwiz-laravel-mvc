import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, ArrowRight } from 'lucide-react';

/**
 * FarmerCalloutBox
 * Callout box displayed on the customer RegisterPage inviting farmers to apply for a stall.
 */
export default function FarmerCalloutBox() {
  return (
    <div className="mt-6 p-4 rounded-2xl bg-white border border-[#E2E8DF] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAF6] border border-[#E2E8DF] flex items-center justify-center text-[#16A34A] shrink-0">
          <Tractor className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#0F172A]">Are you a farmer or local producer?</div>
          <div className="text-[11px] text-[#475569]">
            Register your stall to publish weekly stock and take pre-orders.
          </div>
        </div>
      </div>
      <Link
        to="/register-farmer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAF6] hover:bg-[#E2E8DF] text-[#16A34A] hover:text-[#15803D] border border-[#E2E8DF] font-semibold text-xs transition shrink-0"
      >
        <span>Apply for Stall</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
