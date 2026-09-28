import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

/**
 * FarmerRegistrationSuccess
 * Displayed after a farmer successfully submits their stall application.
 * Shows pending review status and navigation links.
 */
export default function FarmerRegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAF6] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans antialiased text-[#0F172A]">
      <div className="w-full max-w-md bg-white border border-[#E2E8DF] rounded-2xl shadow-xs p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 text-[#16A34A] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Application Submitted!</h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>Status: Pending Administrator Review</span>
        </div>
        <p className="text-xs text-[#475569] leading-relaxed mb-6">
          Thank you for applying to sell at MarketLink! Your farmer credentials and stall profile
          have been registered. Our marketplace operations team reviews new grower submissions within 24-48 hours.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs transition cursor-pointer"
          >
            Go to Sign In
          </button>
          <Link
            to="/"
            className="block text-xs font-medium text-[#475569] hover:text-[#16A34A] transition"
          >
            Return to Marketplace Home
          </Link>
        </div>
      </div>
    </div>
  );
}
