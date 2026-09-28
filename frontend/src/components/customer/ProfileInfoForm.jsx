import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';

/**
 * ProfileInfoForm (Phase 4.11)
 * Form card to update shopper personal identity and pickup contact info.
 */
export default function ProfileInfoForm() {
  const { user, updateProfile } = useAuth();
  const { showAlert } = useModal();

  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Please provide a valid full name for your shopper identity.',
        type: 'danger',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfile({
        fullname: fullname.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      if (res.success) {
        showAlert({
          title: 'Profile Updated',
          message: 'Your personal shopper identity and contact details have been updated.',
          type: 'success',
          autoCloseMs: 2000,
        });
      } else {
        showAlert({
          title: 'Update Failed',
          message: res.message || 'Could not update profile.',
          type: 'danger',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-[#16A34A]" />
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Personal Information</h2>
            <p className="text-[11px] text-[#475569]">Used for order pickup verification and stall reservations</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#16A34A] font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 uppercase">
          {user?.role || 'Customer'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="shopper-fullname" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Full Name</span>
          </label>
          <input
            id="shopper-fullname"
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="e.g. Elena Rostova"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
            required
          />
          <p className="text-[11px] text-[#475569]">Displayed on reservations and inspection slips.</p>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="shopper-email" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Email Address</span>
          </label>
          <input
            id="shopper-email"
            type="email"
            readOnly
            value={user?.email || ''}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-slate-100 text-xs font-semibold text-[#475569] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#475569]">Registered account identifier managed by authentication.</p>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="shopper-phone" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Phone Number</span>
          </label>
          <input
            id="shopper-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. (312) 555-0199"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
          />
          <p className="text-[11px] text-[#475569]">Used by growers if produce requires urgent pickup notice.</p>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label htmlFor="shopper-address" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Address / Neighborhood</span>
          </label>
          <input
            id="shopper-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Lincoln Park, Chicago, IL"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
          />
          <p className="text-[11px] text-[#475569]">Helps match you with nearby weekend farmers markets.</p>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{loading ? 'Saving Profile...' : 'Save Profile Details'}</span>
        </button>
      </div>
    </form>
  );
}
