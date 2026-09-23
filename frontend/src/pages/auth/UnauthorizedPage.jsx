import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const { role, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'farmer' || role === 'operator') return '/farmer/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-[#E2E8DF] rounded-2xl p-8 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            HTTP 403 Forbidden
          </span>
          <h1 className="text-2xl font-black text-[#0F172A] mt-3">Access Restricted</h1>
          <p className="text-xs text-[#475569] mt-1 leading-relaxed">
            Your current account role (<strong>{role || 'guest'}</strong>) does not have authorization to access this administrative module.
          </p>
        </div>

        <div className="pt-4 border-t border-[#E2E8DF] flex flex-col sm:flex-row items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={getDashboardPath()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Your {role?.toUpperCase()} Portal</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Authorized Account</span>
            </Link>
          )}

          <Link
            to="/"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-[#0F172A] text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
