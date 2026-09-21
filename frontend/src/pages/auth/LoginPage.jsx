import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import {
  ShieldCheck,
  Headphones,
  User,
  LogIn,
  KeyRound,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Ambulance,
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getRedirectPath = (targetRole) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') return from;
    if (targetRole === 'admin') return '/admin/dashboard';
    if (targetRole === 'operator') return '/operator/dashboard';
    return '/user/dashboard';
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!loginInput || !passwordInput) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter your Username or Email and Password!',
      });
      return;
    }

    setSubmitting(true);
    const result = await login(loginInput, passwordInput);
    setSubmitting(false);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome ${result.user.fullname} (${result.user.role})!`,
        timer: 1600,
        showConfirmButton: false,
      });
      navigate(getRedirectPath(result.user.role));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: result.message || 'Invalid login credentials!',
      });
    }
  };

  const handleDemoLogin = async (targetRole) => {
    setSubmitting(true);
    const result = await quickDemoLogin(targetRole);
    setSubmitting(false);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: `Demo Login: ${targetRole.toUpperCase()}`,
        text: `Operating as: ${result.user.fullname}`,
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(getRedirectPath(targetRole));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Demo Login Error',
        text: result.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#1F2A37] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl space-y-6">
        {/* Back Link & Brand */}
        <div className="flex items-center justify-between pb-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0B6EFD] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to eAmbulance Catalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-[#0B6EFD]" />
            <span className="text-sm font-black tracking-tight text-[#1F2A37]">
              Life<span className="text-[#0B6EFD]">Link</span> Access Gate
            </span>
          </div>
        </div>

        {/* 2-Column Auth Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: 1-Click Demo Login */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#0B6EFD]">
                <KeyRound className="w-5 h-5" />
                <h2 className="text-lg font-bold text-[#1F2A37]">1-Click Demo Login (3 Roles)</h2>
              </div>
              <p className="text-xs text-[#6B7785] mb-6 leading-relaxed">
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
                      <div className="text-xs font-bold text-[#1F2A37]">System Administrator</div>
                      <div className="text-[11px] text-purple-700">admin@gmail.com (or admin)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-200 text-purple-800 font-bold">
                    admin
                  </span>
                </button>

                {/* Operator Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDemoLogin('operator')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-medium transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0B6EFD] text-white group-hover:scale-105 transition">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#1F2A37]">Emergency Dispatcher</div>
                      <div className="text-[11px] text-blue-700">operator@gmail.com (or operator)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-200 text-blue-800 font-bold">
                    operator
                  </span>
                </button>

                {/* User Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDemoLogin('user')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-medium transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white group-hover:scale-105 transition">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#1F2A37]">Citizen / Patient</div>
                      <div className="text-[11px] text-emerald-700">user@gmail.com (or user)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold">
                    user
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-xs text-[#6B7785] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Default credentials password: <code className="text-[#1F2A37] font-mono font-bold">password123</code>
              </span>
            </div>
          </section>

          {/* Right Column: Manual Sign In */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <form onSubmit={handleManualLogin} className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#084298]">
                  <LogIn className="w-5 h-5" />
                  <h2 className="text-lg font-bold text-[#1F2A37]">Manual Sign In</h2>
                </div>
                <p className="text-xs text-[#6B7785] mb-6">
                  Sign in using either your verified <strong className="text-[#1F2A37]">Email</strong> or <strong className="text-[#1F2A37]">Username</strong>.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2A37] mb-1.5">
                      Username or Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6B7785] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. admin@gmail.com or admin"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2A37] mb-1.5">
                      Account Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#6B7785] absolute left-3 top-3.5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{submitting ? 'Authenticating...' : 'Sign In Now'}</span>
                </button>

                <div className="pt-4 border-t border-[#E2E8F0] text-[11px] text-[#6B7785] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
