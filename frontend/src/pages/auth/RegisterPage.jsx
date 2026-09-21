import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import GoogleSignInButton from '../../components/common/GoogleSignInButton';
import {
  User,
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Ambulance,
  UserPlus,
  Sparkles,
  HeartPulse,
  Clock,
  MapPin,
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showAlert } = useModal();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleDemoFill = () => {
    setFormData({
      fullname: 'Robert Langdon',
      username: 'robert_langdon',
      email: 'robert.langdon@gmail.com',
      phone: '0912-888-999',
      password: 'password123',
      confirmPassword: 'password123',
    });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullname, username, email, phone, password, confirmPassword } = formData;

    if (!fullname.trim() || !username.trim() || !email.trim() || !phone.trim() || !password) {
      setError('All fields are required for emergency patient registration.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    const result = await register({
      fullname,
      username,
      email,
      phone,
      password,
    });
    setSubmitting(false);

    if (result.success) {
      showAlert({
        title: 'Registration Complete!',
        message: `Welcome to LifeLink, ${result.user.fullname}! Your citizen patient portal is active.`,
        type: 'success',
        confirmText: false,
        autoCloseMs: 1600,
      });

      setTimeout(() => {
        navigate('/user/dashboard');
      }, 400);
    } else {
      showAlert({
        title: 'Registration Error',
        message: result.message || 'Registration could not be completed.',
        type: 'danger',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#1F2A37] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl space-y-6">
        {/* Navigation & Header Brand */}
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
              Life<span className="text-[#0B6EFD]">Link</span> Patient Registration
            </span>
          </div>
        </div>

        {/* 2-Column Register Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Why Register & 1-Click Demo Fill (5 cols) */}
          <section className="md:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 text-[#0B6EFD]">
                  Citizen Medical Portal
                </span>
                <h2 className="text-lg font-bold text-[#1F2A37] mt-2">
                  Rapid Emergency Care Membership
                </h2>
                <p className="text-xs text-[#6B7785] mt-1 leading-relaxed">
                  Pre-registering your emergency contact details accelerates triage times by up to 65% when requesting certified ambulances.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-lg bg-red-50 text-[#DC3545] shrink-0 mt-0.5">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2A37] block">1-Touch Emergency SOS</span>
                    <span className="text-[#6B7785] text-[11px]">Instantly broadcast browser GPS beacons to Chicago Dispatch.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-[#0B6EFD] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2A37] block">Live Fleet Telemetry</span>
                    <span className="text-[#6B7785] text-[11px]">Track assigned ICU & ALS ambulances on the map in real time.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2A37] block">Transport Records & Reviews</span>
                    <span className="text-[#6B7785] text-[11px]">Access historical care logs and submit paramedic reviews.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1-Click Demo Fill Action */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>1-Click Demo Fill (For Evaluation)</span>
              </button>
              <div className="text-[11px] text-[#6B7785] flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sanctum Token & RBAC Role: <code className="font-bold text-[#1F2A37]">user</code></span>
              </div>
            </div>
          </section>

          {/* Right Column: Registration Form (7 cols) */}
          <section className="md:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-[#0B6EFD]">
                  <UserPlus className="w-5 h-5" />
                  <h2 className="text-lg font-bold text-[#1F2A37]">Register Patient Account</h2>
                </div>
                <p className="text-xs text-[#6B7785]">
                  Fill in your details below to create your patient profile.
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#DC3545] text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Full Name <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B7785] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Langdon"
                      value={formData.fullname}
                      onChange={(e) => handleInputChange('fullname', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Username <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-[#6B7785] font-mono text-xs absolute left-3 top-2.5">@</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. robert_langdon"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Email Address <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B7785] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. robert@gmail.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Phone Number <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#6B7785] absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0912-888-999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Password <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#6B7785] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Confirm Password <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <CheckCircle2 className="w-4 h-4 text-[#6B7785] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{submitting ? 'Registering Account...' : 'Create Patient Account'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-[#E2E8F0]"></div>
                <span className="shrink mx-4 text-[11px] text-[#6B7785] font-medium uppercase">
                  Or continue with
                </span>
                <div className="grow border-t border-[#E2E8F0]"></div>
              </div>

              {/* Google Social Sign In */}
              <GoogleSignInButton text="Continue with Google" />

              {/* Sign In Link */}
              <div className="pt-3 border-t border-[#E2E8F0] text-center text-xs text-[#6B7785]">
                Already have an emergency portal account?{' '}
                <Link to="/login" className="font-bold text-[#0B6EFD] hover:underline">
                  Sign In Here
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
