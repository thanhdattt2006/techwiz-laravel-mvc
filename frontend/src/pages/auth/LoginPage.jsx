import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import GoogleSignInButton from '../../components/common/GoogleSignInButton';
import {
  ShieldCheck,
  Tractor,
  User,
  LogIn,
  KeyRound,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Sprout,
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickDemoLogin } = useAuth();
  const { showAlert } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getRedirectPath = (targetRole) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') return from;
    if (targetRole === 'admin') return '/admin/dashboard';
    if (targetRole === 'operator' || targetRole === 'farmer') return '/farmer/dashboard';
    return '/customer/dashboard';
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!loginInput || !passwordInput) {
      showAlert({
        title: 'Missing Information',
        message: 'Please enter your Username or Email and Password!',
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    const result = await login(loginInput, passwordInput);
    setSubmitting(false);

    if (result.success) {
      showAlert({
        title: 'Login Successful!',
        message: `Welcome ${result.user.fullname}!`,
        type: 'success',
        confirmText: false,
        autoCloseMs: 1500,
      });
      setTimeout(() => {
        navigate(getRedirectPath(result.user.role));
      }, 400);
    } else {
      showAlert({
        title: 'Login Failed',
        message: result.message || 'Invalid login credentials!',
        type: 'danger',
      });
    }
  };

  const handleDemoLogin = async (targetRole) => {
    setSubmitting(true);
    const result = await quickDemoLogin(targetRole);
    setSubmitting(false);

    if (result.success) {
      showAlert({
        title: `Demo Login: ${targetRole.toUpperCase()}`,
        message: `Operating as: ${result.user.fullname}`,
        type: 'success',
        confirmText: false,
        autoCloseMs: 1400,
      });
      setTimeout(() => {
        navigate(getRedirectPath(targetRole));
      }, 400);
    } else {
      showAlert({
        title: 'Demo Login Error',
        message: result.message,
        type: 'danger',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl space-y-6">
        {/* Back Link & Brand */}
        <div className="flex items-center justify-between pb-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Fresh Marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#16A34A]" />
            <span className="text-sm font-black tracking-tight text-[#0F172A]">
              Market<span className="text-[#16A34A]">Link</span> Portal Access
            </span>
          </div>
        </div>

        {/* 2-Column Auth Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: 1-Click Demo Login */}
          <section className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#16A34A]">
                <KeyRound className="w-5 h-5" />
                <h2 className="text-lg font-bold text-[#0F172A]">1-Click Demo Login (3 Roles)</h2>
              </div>
              <p className="text-xs text-[#475569] mb-6 leading-relaxed">
                Single-touch instant authentication for judges, evaluators, and test operations without typing passwords.
              </p>

              <div className="space-y-3">
                {/* Admin Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDemoLogin('admin')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-medium transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-600 text-white group-hover:scale-105 transition">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#0F172A]">Platform Administrator</div>
                      <div className="text-[11px] text-purple-700">admin@gmail.com (MarketLink HQ)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-200 text-purple-800 font-bold">
                    admin
                  </span>
                </button>

                {/* Farmer / Vendor Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDemoLogin('operator')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-medium transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#16A34A] text-white group-hover:scale-105 transition">
                      <Tractor className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#0F172A]">Farmer & Stall Master</div>
                      <div className="text-[11px] text-emerald-700">operator@gmail.com (Prairie Organic Grove)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold">
                    farmer
                  </span>
                </button>

                {/* Customer / Shopper Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDemoLogin('user')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-medium transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-600 text-white group-hover:scale-105 transition">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#0F172A]">Customer & Local Shopper</div>
                      <div className="text-[11px] text-blue-700">user@gmail.com (Elena Rostova)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-200 text-blue-800 font-bold">
                    shopper
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8DF] text-xs text-[#475569] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>
                Default credentials password: <code className="text-[#0F172A] font-mono font-bold">password123</code>
              </span>
            </div>
          </section>

          {/* Right Column: Manual Sign In */}
          <section className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <form onSubmit={handleManualLogin} className="flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#16A34A]">
                  <LogIn className="w-5 h-5" />
                  <h2 className="text-lg font-bold text-[#0F172A]">Manual Sign In</h2>
                </div>
                <p className="text-xs text-[#475569] mb-5">
                  Sign in using either your verified <strong className="text-[#0F172A]">Email</strong> or <strong className="text-[#0F172A]">Username</strong>.
                </p>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                      Username or Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. admin@gmail.com or admin"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#0F172A]">
                        Account Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] font-semibold text-[#16A34A] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#475569] absolute left-3 top-3.5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{submitting ? 'Authenticating...' : 'Sign In Now'}</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="grow border-t border-[#E2E8DF]"></div>
                  <span className="shrink mx-3 text-[10px] text-[#475569] font-semibold uppercase">
                    Or sign in with
                  </span>
                  <div className="grow border-t border-[#E2E8DF]"></div>
                </div>

                {/* Google Sign In */}
                <GoogleSignInButton text="Sign in with Google" />

                {/* Don't have an account link */}
                <div className="text-center text-xs text-[#475569] pt-1">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-[#16A34A] hover:underline">
                    Sign up now
                  </Link>
                </div>

                <div className="pt-3 border-t border-[#E2E8DF] text-[11px] text-[#475569] flex items-center gap-1.5 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Session & Role-Based Access Control (RBAC) Active</span>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
