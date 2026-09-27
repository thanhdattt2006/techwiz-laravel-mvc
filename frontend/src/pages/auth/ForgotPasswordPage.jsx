import React from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  Mail,
  ArrowLeft,
  Sprout,
  ShieldCheck,
  Phone,
  MessageSquare,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-lg space-y-6">
        {/* Back Link & Brand */}
        <div className="flex items-center justify-between pb-2">
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#16A34A]" />
            <span className="text-sm font-black tracking-tight text-[#0F172A]">
              Market<span className="text-[#16A34A]">Link</span> Helpdesk
            </span>
          </div>
        </div>

        {/* Main Support Card */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-[#0F172A]">Password Recovery Support</h1>
            <p className="text-xs text-[#475569] leading-relaxed">
              To safeguard farm stall operations and customer privacy, account password resets are verified directly by MarketLink Platform Administration.
            </p>
          </div>

          {/* Instructions Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>How to Reset Your Account Credentials</span>
            </div>
            <p className="text-[#475569] leading-relaxed">
              Please submit an inquiry with your registered email or username through our public Contact Desk. Our system administration team will verify your identity and issue temporary login credentials within business hours.
            </p>
            <div className="pt-2 border-t border-emerald-200/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-emerald-900">
                <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Support Email: <strong className="font-semibold">support@marketlink.com</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-900">
                <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Hotline: <strong className="font-semibold">(312) 555-FARM</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/contact"
              className="w-full py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit Recovery Request via Contact Form</span>
            </Link>

            <Link
              to="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAF6] hover:bg-slate-100 border border-[#E2E8DF] text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Return to Login Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
