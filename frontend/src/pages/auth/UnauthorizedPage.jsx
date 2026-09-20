import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const { role, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'operator') return '/operator/dashboard';
    return '/user/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#DC3545] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC3545] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            HTTP 403 Forbidden
          </span>
          <h1 className="text-2xl font-black text-[#1F2A37] mt-3">Access Restricted</h1>
          <p className="text-xs text-[#6B7785] mt-1 leading-relaxed">
            Your current account role (<strong>{role || 'guest'}</strong>) does not have authorization to access this administrative module.
          </p>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={getDashboardPath()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B6EFD] text-white text-xs font-bold hover:bg-[#084298] transition flex items-center justify-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Your {role?.toUpperCase()} Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B6EFD] text-white text-xs font-bold hover:bg-[#084298] transition flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Authorized Account</span>
            </Link>
          )}

          <Link
            to="/"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-[#1F2A37] text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
