import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import {
  UserPlus, Mail, Phone, KeyRound, User, ArrowLeft,
  Sprout, MapPin, Eye, EyeOff, AlertCircle,
} from 'lucide-react';
import FarmerCalloutBox from '../../components/auth/FarmerCalloutBox';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { alert } = useModal();

  const [formData, setFormData] = useState({
    fullname: '', username: '', email: '', phone: '',
    address: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password.length < 8) { setError('Password must be at least 8 characters long.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }

    setSubmitting(true);
    try {
      const payload = {
        fullname: formData.fullname.trim(), username: formData.username.trim(),
        email: formData.email.trim(), phone: formData.phone.trim(),
        address: formData.address.trim(), password: formData.password,
      };
      const result = await register(payload);
      if (result.success) {
        await alert({ title: 'Welcome to MarketLink!', message: 'Your shopper account was created successfully. You are now signed in.', type: 'success' });
        navigate('/customer/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans antialiased text-[#0F172A]">
      <div className="w-full max-w-xl">
        {/* Back Link */}
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#16A34A] transition">
            <ArrowLeft className="w-4 h-4" />Back to Public Marketplace
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold tracking-tight text-[#0F172A]">MarketLink</div>
              <div className="text-[10px] uppercase tracking-wider text-[#16A34A] font-semibold">Farm Fresh Hub</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A]">Create Shopper Account</h1>
          <p className="text-xs text-[#475569] mt-1 max-w-md mx-auto">Join MarketLink to discover and pre-order fresh seasonal produce directly from local family farms.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl shadow-xs p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Full Name <span className="text-[#DC2626]">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                  <input type="text" required placeholder="e.g. Elena Vance" value={formData.fullname} onChange={(e) => handleInputChange('fullname', e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Username <span className="text-[#DC2626]">*</span></label>
                <div className="relative">
                  <span className="text-[#475569] absolute left-3 top-2 text-xs font-medium">@</span>
                  <input type="text" required placeholder="elenavance" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} className="w-full pl-8 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Email Address <span className="text-[#DC2626]">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                  <input type="email" required placeholder="elena@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Phone Number <span className="text-[#DC2626]">*</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                  <input type="tel" required placeholder="(312) 555-0192" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Physical Address / Neighborhood <span className="text-[#DC2626]">*</span></label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                  <input type="text" required placeholder="e.g. 742 Evergreen Terrace, Chicago, IL" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#0F172A]">Password <span className="text-[#DC2626]">*</span></label>
                  <span className="text-[10px] text-[#475569]">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="w-full pl-9 pr-8 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-2 text-[#475569] hover:text-[#0F172A] transition">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Confirm Password <span className="text-[#DC2626]">*</span></label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={submitting} className="w-full py-2.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50">
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? 'Registering Account...' : 'Create Shopper Account'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-[#E2E8DF] text-center text-xs text-[#475569]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#16A34A] hover:underline">Sign In Here</Link>
            </div>
          </form>
        </div>

        {/* Farmer Application Callout (Delegated) */}
        <FarmerCalloutBox />
      </div>
    </div>
  );
}
