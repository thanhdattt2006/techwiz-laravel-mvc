import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import {
  KeyRound,
  Mail,
  ArrowLeft,
  Sprout,
  CheckCircle2,
  ShieldAlert,
  Send,
  RefreshCw,
  Lock,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { showAlert } = useModal();
  const navigate = useNavigate();

  // Multi-step: 1 = Enter Email/Username, 2 = Enter OTP & New Password
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Cooldown countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!identity.trim()) {
      setError('Please enter your registered email address or username.');
      return;
    }

    setError('');
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
      setCountdown(60);
      setOtp('123456'); // Pre-fill demo OTP for tester convenience
      showAlert({
        title: 'Verification Code Dispatched',
        message: `A 6-digit OTP verification token has been simulated for ${identity}. Demo OTP: 123456`,
        type: 'info',
        confirmText: false,
        autoCloseMs: 2500,
      });
    }, 500);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setCountdown(60);
    showAlert({
      title: 'New OTP Dispatched',
      message: `A fresh 6-digit verification code has been simulated for ${identity}. Demo code: 123456`,
      type: 'info',
      confirmText: false,
      autoCloseMs: 2000,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    const result = await resetPassword({ identity, otp, newPassword });
    setSubmitting(false);

    if (result.success) {
      showAlert({
        title: 'Password Successfully Reset!',
        message: result.message,
        type: 'success',
        confirmText: false,
        autoCloseMs: 2000,
      });

      setTimeout(() => {
        navigate('/login');
      }, 500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-md space-y-6">
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
              Market<span className="text-[#16A34A]">Link</span> Recovery
            </span>
          </div>
        </div>

        {/* Step Progression Indicator */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-4 flex items-center justify-between shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-[#16A34A] text-white' : 'bg-slate-100 text-[#475569]'
              }`}
            >
              1
            </span>
            <span className={`font-semibold ${step === 1 ? 'text-[#16A34A]' : 'text-[#0F172A]'}`}>
              Request OTP
            </span>
          </div>

          <div className="w-12 h-0.5 bg-[#E2E8DF]">
            <div
              className={`h-full bg-[#16A34A] transition-all duration-300 ${
                step === 2 ? 'w-full' : 'w-0'
              }`}
            ></div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 2 ? 'bg-[#16A34A] text-white' : 'bg-slate-100 text-[#475569]'
              }`}
            >
              2
            </span>
            <span className={`font-semibold ${step === 2 ? 'text-[#16A34A]' : 'text-[#475569]'}`}>
              Reset Password
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-[#0F172A]">
              {step === 1 ? 'Forgot Your Password?' : 'Enter Verification Code'}
            </h1>
            <p className="text-xs text-[#475569] leading-relaxed">
              {step === 1
                ? "Enter your account email or username. We'll send an OTP code to verify your identity."
                : `Verification code sent to ${identity}. Please enter the OTP and your new password.`}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#DC2626] text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Request OTP Form */}
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Email Address or Username <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. user@gmail.com or user"
                    value={identity}
                    onChange={(e) => {
                      setIdentity(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                  />
                </div>
              </div>

              {/* Quick Fill Demo Helper */}
              <div className="flex items-center justify-between text-[11px] text-[#475569] pt-1">
                <span>Test with demo account:</span>
                <button
                  type="button"
                  onClick={() => setIdentity('user@gmail.com')}
                  className="text-[#16A34A] font-bold hover:underline cursor-pointer"
                >
                  user@gmail.com
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting Code...' : 'Send Verification OTP'}</span>
              </button>
            </form>
          ) : (
            /* Step 2: Verify OTP and Set New Password */
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Demo OTP Banner */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold">Evaluation Demo OTP:</span>{' '}
                  <code className="font-mono font-bold text-amber-950 bg-amber-200 px-1.5 py-0.5 rounded">
                    123456
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="text-[11px] text-[#16A34A] font-bold hover:underline cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  6-Digit Verification Code <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 text-center font-mono text-base tracking-widest bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  New Account Password <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#475569] absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Confirm New Password <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 text-[#475569] absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                  />
                </div>
              </div>

              {/* Cooldown Resend & Back controls */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }}
                  className="text-[#475569] hover:text-[#0F172A] font-semibold cursor-pointer"
                >
                  Change Email / User
                </button>

                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleResendOtp}
                  className={`flex items-center gap-1 font-bold ${
                    countdown > 0
                      ? 'text-[#475569] cursor-not-allowed'
                      : 'text-[#16A34A] hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${countdown > 0 ? 'animate-spin' : ''}`} />
                  <span>{countdown > 0 ? `Resend code (${countdown}s)` : 'Resend OTP'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 mt-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{submitting ? 'Resetting Password...' : 'Save New Password & Sign In'}</span>
              </button>
            </form>
          )}

          {/* Bottom helper */}
          <div className="pt-4 border-t border-[#E2E8DF] text-center text-xs text-[#475569]">
            Remembered your credentials?{' '}
            <Link to="/login" className="font-bold text-[#16A34A] hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
