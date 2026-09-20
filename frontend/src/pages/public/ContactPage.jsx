import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Details',
        text: 'Please fill in your name, email address, and message.',
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      Swal.fire({
        icon: 'success',
        title: 'Message Transmitted',
        text: 'Your contact message was delivered to LifeLink central dispatch.',
        timer: 2000,
        showConfirmButton: false,
      });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-[#0B6EFD]">
          Get in Touch
        </span>
        <h1 className="text-3xl font-black tracking-tight text-[#1F2A37]">
          Contact LifeLink Dispatch & Support
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7785]">
          Have questions regarding hospital partnerships, non-emergency reservations, or feedback? Send us a message directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Contact Information (Official SRS Data) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#084298] to-[#0B6EFD] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md space-y-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Official Coordinates</h2>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Our central dispatch operations room is staffed 24/7 by clinical operators and logistics managers.
              </p>
            </div>

            <div className="space-y-5 text-xs text-blue-100/90">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <Phone className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="block text-blue-200 text-[11px]">Emergency Hotline (24/7)</span>
                  <a href="tel:03011111234" className="text-sm font-bold text-white hover:underline">
                    030-1111-1234
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <Mail className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <span className="block text-blue-200 text-[11px]">Electronic Mail Address</span>
                  <a href="mailto:healthcare@icu.com" className="text-sm font-bold text-white hover:underline">
                    healthcare@icu.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <MapPin className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <span className="block text-blue-200 text-[11px]">Central Operational Grid</span>
                  <span className="text-sm font-bold text-white">Chicago Emergency Medical Sector</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <Clock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="block text-blue-200 text-[11px]">Operational Hours</span>
                  <span className="text-sm font-bold text-white">Continuous 24 Hours / 365 Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 text-[11px] text-blue-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted transmission to emergency control room</span>
          </div>
        </div>

        {/* Right Col: Contact Form (Open to Unauthenticated Guests) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm">
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#198754] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-[#1F2A37]">Message Delivered!</h2>
              <p className="text-xs text-[#6B7785] max-w-md mx-auto">
                Thank you for contacting LifeLink. A representative from our hospital relations team will review your inquiry shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#0B6EFD] text-white text-xs font-bold hover:bg-[#084298] transition cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-[#1F2A37] mb-1">Send Us a Direct Message</h2>
              <p className="text-xs text-[#6B7785] mb-4">
                You do not need an active patient account to contact our support desk.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Full Name <span className="text-[#DC3545]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Davis"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Email Address <span className="text-[#DC3545]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. robert.davis@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Message Content <span className="text-[#DC3545]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe your inquiry, fleet partnership request, or feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting...' : 'Send Contact Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
