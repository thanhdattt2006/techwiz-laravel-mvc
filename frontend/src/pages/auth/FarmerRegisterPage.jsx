import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Tractor,
  Mail,
  Phone,
  KeyRound,
  User,
  ArrowLeft,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function FarmerRegisterPage() {
  const navigate = useNavigate();
  const { registerFarmer } = useAuth();

  const [farmerData, setFarmerData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    stall_name: '',
    contact_person: '',
    contact_phone: '',
    address: '',
    description: '',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFarmerData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (farmerData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (farmerData.password !== farmerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullname: farmerData.fullname.trim(),
        username: farmerData.username.trim(),
        email: farmerData.email.trim(),
        phone: farmerData.phone.trim(),
        password: farmerData.password,
        stall_name: farmerData.stall_name.trim(),
        contact_person: farmerData.contact_person.trim(),
        contact_phone: farmerData.contact_phone.trim(),
        address: farmerData.address.trim(),
        description: farmerData.description ? farmerData.description.trim() : null,
      };

      const result = await registerFarmer(payload);

      if (result.success) {
        setSubmittedSuccess(true);
      } else {
        setError(result.error || 'Submission failed. Please verify your stall information.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
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

  return (
    <div className="min-h-screen bg-[#F8FAF6] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans antialiased text-[#0F172A]">
      <div className="w-full max-w-2xl">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#16A34A] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Marketplace
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-xs">
              <Tractor className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold tracking-tight text-[#0F172A]">MarketLink</div>
              <div className="text-[10px] uppercase tracking-wider text-[#16A34A] font-semibold">
                Farmer & Producer Portal
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A]">Farmer Stall Application</h1>
          <p className="text-xs text-[#475569] mt-1 max-w-md mx-auto">
            Apply to open your stall, configure weekly harvest quotas, and accept pre-orders for weekend pickup.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E2E8DF] rounded-2xl shadow-xs p-6 sm:p-8">
          {/* Notice Banner */}
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Approval Notice:</span> Farmer applications are submitted with a{' '}
              <span className="font-semibold underline">Pending</span> status and reviewed by MarketLink
              administrators before stall activation.
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: User Account */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wider pb-1 border-b border-[#E2E8DF]">
                1. Producer Account Credentials
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Your Full Legal Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arthur Pendelton"
                      value={farmerData.fullname}
                      onChange={(e) => handleInputChange('fullname', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Username <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-[#475569] absolute left-3 top-2 text-xs font-medium">@</span>
                    <input
                      type="text"
                      required
                      placeholder="arthur_organic"
                      value={farmerData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Email Address <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="arthur@prairieorganic.com"
                      value={farmerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Mobile Phone Number <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="(312) 555-4421"
                      value={farmerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#0F172A]">
                      Password <span className="text-[#DC2626]">*</span>
                    </label>
                    <span className="text-[10px] text-[#475569]">Min. 8 characters</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={farmerData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-[#475569] hover:text-[#0F172A] transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Confirm Password <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={farmerData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Farm & Stall Info */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wider pb-1 border-b border-[#E2E8DF]">
                2. Farm Stall Operations & Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Farm / Stall Trade Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prairie Organic Grove"
                    value={farmerData.stall_name}
                    onChange={(e) => handleInputChange('stall_name', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Stall Contact Person <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arthur Pendelton"
                    value={farmerData.contact_person}
                    onChange={(e) => handleInputChange('contact_person', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Stall Hotline / Direct Contact Phone <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. (312) 555-4421"
                    value={farmerData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Farm Location / Main Address <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rural Route 4, Woodstock, IL 60098"
                      value={farmerData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Agricultural Specialties & Farm Bio (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Certified organic heirloom tomatoes, seasonal root vegetables, and fresh berries."
                    value={farmerData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Tractor className="w-4 h-4" />
                <span>{submitting ? 'Submitting Stall Application...' : 'Submit Stall Application'}</span>
              </button>
            </div>

            {/* Back to Customer Link */}
            <div className="pt-3 border-t border-[#E2E8DF] text-center text-xs text-[#475569]">
              Looking for a shopper account instead?{' '}
              <Link to="/register" className="font-bold text-[#16A34A] hover:underline">
                Register as Shopper
              </Link>
            </div>
          </form>
        </div>

        {/* Existing User Login Prompt */}
        <div className="mt-6 text-center text-xs text-[#475569]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#16A34A] hover:underline inline-flex items-center gap-1">
            <span>Sign In to your Stall</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
