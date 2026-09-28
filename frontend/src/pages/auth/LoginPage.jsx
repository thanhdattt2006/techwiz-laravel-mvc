import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import {
  LogIn,
  KeyRound,
  Mail,
  ArrowLeft,
  Sprout,
  Eye,
  EyeOff,
  HelpCircle,
} from 'lucide-react';
import { sanitizeEnglishPassword } from '../../utils/sanitizeEnglishPassword';

export default function LoginPage() {
  const { login } = useAuth();
  const { showAlert } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getRedirectPath = (targetRole) => {
    const fromPath = location.state?.from?.pathname;
    const fromSearch = location.state?.from?.search || '';
    if (fromPath && fromPath !== '/login') return `${fromPath}${fromSearch}`;
    if (targetRole === 'admin') return '/admin/dashboard';
    if (targetRole === 'operator' || targetRole === 'farmer')
      return '/farmer/dashboard';
    return '/customer/dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginInput.trim() || !passwordInput) {
      showAlert({
        title: 'Missing Information',
        message: 'Please enter your username or email address and password.',
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    const result = await login(loginInput.trim(), passwordInput);
    setSubmitting(false);

    if (result.success) {
      showAlert({
        title: 'Login Successful',
        message: `Welcome back, ${result.user?.fullname || 'User'}!`,
        type: 'success',
        confirmText: false,
        autoCloseMs: 1200,
      });
      setTimeout(() => {
        navigate(getRedirectPath(result.user?.role));
      }, 300);
    } else {
      showAlert({
        title: 'Authentication Failed',
        message: result.message || 'Invalid username/email or password.',
        type: 'danger',
      });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showAlert({
      title: 'Password Recovery Support',
      message:
        'For account security, password resets are processed by MarketLink administrators. Please submit a request via our Contact Helpdesk or email support@marketlink.com.',
      type: 'info',
      confirmText: 'Contact Support',
      onConfirm: () => navigate('/contact'),
    });
  };

  return (
    <div className='min-h-screen bg-[#F8FAF6] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-8 font-sans'>
      <div className='w-full max-w-md space-y-6'>
        {/* Back Link */}
        <div className='flex items-center justify-start'>
          <Link
            to='/'
            className='inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#15803D] hover:underline transition'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Return to Fresh Marketplace</span>
          </Link>
        </div>

        {/* Centered Login Card */}
        <div className='bg-white border border-[#E2E8DF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6'>
          {/* Header */}
          <div className='text-center space-y-2'>
            <Link to='/' className='inline-block mb-2'>
              <img
                src='/logo.png'
                alt='MarketLink Logo'
                className='w-12 h-12 mx-auto object-contain hover:scale-105 transition-transform'
              />
            </Link>
            <div className='text-xs font-bold uppercase tracking-wider text-[#16A34A]'>
              MarketLink Portal
            </div>
            <h1 className='text-2xl font-black text-[#0F172A] tracking-tight'>
              Welcome Back
            </h1>
            <p className='text-xs text-[#475569] leading-relaxed'>
              Sign in to your account with your username or email address.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-[#0F172A] mb-1.5'>
                Username or Email Address
              </label>
              <div className='relative'>
                <Mail className='w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5' />
                <input
                  type='text'
                  required
                  autoFocus
                  placeholder='Enter your username or email'
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className='w-full pl-10 pr-4 py-2.5 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#16A34A] focus:bg-white transition'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label className='block text-xs font-semibold text-[#0F172A]'>
                  Password
                </label>
                <button
                  type='button'
                  onClick={handleForgotPassword}
                  tabIndex={-1}
                  className='text-[11px] font-semibold text-[#16A34A] hover:underline cursor-pointer flex items-center gap-1'
                >
                  <HelpCircle className='w-3 h-3' />
                  <span>Forgot password?</span>
                </button>
              </div>
              <div className='relative'>
                <KeyRound className='w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoCapitalize='none'
                  autoCorrect='off'
                  spellCheck='false'
                  lang='en'
                  placeholder='Enter your password'
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(sanitizeEnglishPassword(e.target.value))}
                  className='w-full pl-10 pr-10 py-2.5 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#16A34A] focus:bg-white transition'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-[#64748B] hover:text-[#0F172A] cursor-pointer'
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='w-full py-3 px-4 mt-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50'
            >
              <LogIn className='w-4 h-4' />
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className='pt-4 border-t border-[#E2E8DF] text-center text-xs text-[#475569]'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='font-bold text-[#16A34A] hover:underline'
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Security / System Footer */}
        <p className='text-center text-[11px] text-[#64748B]'>
          Protected by MarketLink Security. Farm Fresh Just a Click Away.
        </p>
      </div>
    </div>
  );
}
