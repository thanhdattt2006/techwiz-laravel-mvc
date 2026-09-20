import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import axiosClient from './api/axiosClient';
import Swal from 'sweetalert2';
import {
  ShieldAlert,
  ShieldCheck,
  Headphones,
  User,
  LogIn,
  LogOut,
  Activity,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  const { user, role, isAuthenticated, isLoading, login, logout, quickDemoLogin } = useAuth();

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    axiosClient
      .get('/health')
      .then((res) => setHealthStatus(res))
      .catch(() => setHealthStatus({ success: false, status: 'offline' }));
  }, []);

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
        timer: 2000,
        showConfirmButton: false,
      });
      setLoginInput('');
      setPasswordInput('');
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
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Demo Login Error',
        text: result.message,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    Swal.fire({
      icon: 'info',
      title: 'Logged Out',
      text: 'Your session has ended safely.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/10">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Rapid Rescue <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Phase 0.5 Verified</span>
            </h1>
            <p className="text-sm text-slate-400">Laravel REST Web API + React Vite Monorepo</p>
          </div>
        </div>

        {/* Backend API Health Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <Activity className={`w-4 h-4 ${healthStatus?.success ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-slate-400">API Status:</span>
          <span className={`font-semibold ${healthStatus?.success ? 'text-emerald-400' : 'text-amber-400'}`}>
            {healthStatus?.success ? 'Online (Render/Local)' : 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Left Column: Quick 3-Role Demo Login */}
        <section className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <KeyRound className="w-5 h-5" />
              <h2 className="text-lg font-semibold text-white">Quick 3-Role Demo Login</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              1-Click Demo Login for competition judges and team members to test role-based access without typing passwords.
            </p>

            <div className="space-y-3">
              {/* Admin Button */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleDemoLogin('admin')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">System Administrator (Admin)</div>
                    <div className="text-xs text-purple-300/70">admin@gmail.com (or admin)</div>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-purple-900/60 text-purple-200">Role: admin</span>
              </button>

              {/* Operator Button */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleDemoLogin('operator')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Emergency Dispatcher (Operator)</div>
                    <div className="text-xs text-blue-300/70">operator@gmail.com (or operator)</div>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-blue-900/60 text-blue-200">Role: operator</span>
              </button>

              {/* User Button */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleDemoLogin('user')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Citizen / Patient (User)</div>
                    <div className="text-xs text-emerald-300/70">user@gmail.com (or user)</div>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-900/60 text-emerald-200">Role: user</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Default credentials password: <code className="text-slate-300 font-mono">password123</code></span>
          </div>
        </section>

        {/* Right Column: Active Session Card OR Manual Login Form */}
        <section className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          {isAuthenticated && user ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">Active Session</h2>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Role: {role}
                </span>
              </div>

              {/* User Profile Card */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2.5 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Full Name:</span>
                  <span className="font-semibold text-white">{user.fullname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Username:</span>
                  <span className="font-mono text-indigo-300">@{user.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-200">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-200">{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 capitalize">{user.status}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-medium transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualLogin} className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <LogIn className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">Manual Sign In</h2>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Sign in using either <strong className="text-white">Email</strong> or <strong className="text-white">Username</strong>.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Username or Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. admin@gmail.com or admin"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{submitting ? 'Authenticating...' : 'Sign In Now'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Security: Laravel Sanctum Bearer Token</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        TechWiz 7 Emergency Platform • Backend Laravel Web API • Frontend React 19 Vite TailwindCSS v4
      </footer>
    </div>
  );
}
