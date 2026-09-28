import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Tractor,
  ArrowLeft,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import FarmerRegistrationSuccess from '../../components/auth/FarmerRegistrationSuccess';
import FarmerStallDetailsForm from '../../components/auth/FarmerStallDetailsForm';
import FarmerAccountFields from '../../components/auth/FarmerAccountFields';

export default function FarmerRegisterPage() {
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
    return <FarmerRegistrationSuccess />;
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
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <img
              src="/logo.png"
              alt="MarketLink Logo"
              className="w-10 h-10 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
            />
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
            {/* Section 1: User Account (Delegated) */}
            <FarmerAccountFields
              farmerData={farmerData}
              onInputChange={handleInputChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Section 2: Farm & Stall Info (Delegated) */}
            <FarmerStallDetailsForm farmerData={farmerData} onInputChange={handleInputChange} />

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
