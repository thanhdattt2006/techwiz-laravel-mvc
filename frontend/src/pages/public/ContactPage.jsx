import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Sprout,
  CheckCircle2,
  Store,
  Compass,
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export default function ContactPage() {
  const { showAlert } = useModal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Pre-Order Question');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showAlert({
        title: 'Missing Required Fields',
        message: 'Please provide your name, email address, and inquiry message.',
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      showAlert({
        title: 'Inquiry Dispatched',
        message: 'Your message has been delivered to the Chicago MarketLink operations office. We will reply within 24 hours!',
        type: 'success',
        confirmText: false,
        autoCloseMs: 2200,
      });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
          Market Administration • Community Help Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
          Contact MarketLink Office & Farmer Helpline
        </h1>
        <p className="text-xs sm:text-sm text-[#475569]">
          Have questions regarding local farmers markets, stall vendor registration, or weekend pickup reservations? Reach out to our Chicago Green Loop market operations team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Information (Official MarketLink Office Coordinates) */}
        <div className="lg:col-span-5 bg-linear-to-br from-[#16A34A] to-[#15803D] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-8">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 mb-3">
                <Sprout className="w-3.5 h-3.5 text-emerald-200" />
                <span>Central Green Loop Headquarters</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Market Coordination Hub</h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Our central market team coordinates vendor stall allocations, inspects organic compliance, and assists shoppers across all 6 Chicago community markets.
              </p>
            </div>

            <div className="space-y-5 text-xs text-emerald-100">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <Phone className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="block text-emerald-200 text-[11px] font-semibold">Farmer & Shopper Helpline</span>
                  <a href="tel:3125553276" className="text-sm font-bold text-white hover:underline">
                    (312) 555-FARM / (312) 555-3276
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <Mail className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <span className="block text-emerald-200 text-[11px] font-semibold">Support & Vendor Inquiries</span>
                  <a href="mailto:support@marketlink.org" className="text-sm font-bold text-white hover:underline block">
                    support@marketlink.org
                  </a>
                  <a href="mailto:vendors@marketlink.org" className="text-xs text-emerald-200 hover:underline">
                    vendors@marketlink.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <MapPin className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="block text-emerald-200 text-[11px] font-semibold">MarketLink Operations HQ</span>
                  <span className="text-sm font-bold text-white block">450 N Michigan Ave, Chicago, IL 60611</span>
                  <span className="text-[11px] text-emerald-200">Green Loop Central Administrative Suite</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                  <Clock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="block text-emerald-200 text-[11px] font-semibold">Office & Market Hours</span>
                  <span className="text-xs font-bold text-white block">Mon – Fri: 08:00 AM – 05:00 PM CST</span>
                  <span className="text-xs text-emerald-200 block">Sat Market Coordination: 06:30 AM – 02:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 text-[11px] text-emerald-100 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Dedicated to zero food miles & community family farms</span>
          </div>
        </div>

        {/* Right Col: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs">
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">Message Successfully Delivered!</h2>
              <p className="text-xs text-[#475569] max-w-md mx-auto">
                Thank you for contacting MarketLink. A member of our Chicago market operations team will review your inquiry and follow up within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition cursor-pointer shadow-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Send Us a Direct Message</h2>
                <p className="text-xs text-[#475569] mb-4">
                  Open to all shoppers, family growers, market volunteers, and community food partners.
                </p>
              </div>

              <div>
                <label htmlFor="contact-full-name-input" className="block font-bold text-[#0F172A] mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-full-name-input"
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="contact-email-input" className="block font-bold text-[#0F172A] mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email-input"
                  type="email"
                  required
                  placeholder="e.g. sarah@prairieorganics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="contact-topic-select" className="block font-bold text-[#0F172A] mb-1">
                  Inquiry Topic
                </label>
                <select
                  id="contact-topic-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
                >
                  <option value="Pre-Order Question">Weekend Pre-Order & Stall Pickup Question</option>
                  <option value="Stall Vendor Application">Farmer Stall Application & Permit Inquiries</option>
                  <option value="Volunteer Opportunity">Volunteer Tote Packing & Market Support</option>
                  <option value="SNAP/LINK Matching">SNAP / LINK Food Assistance Matching Coupons</option>
                  <option value="General Inquiries">General Market Question or Community Suggestion</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message-textarea" className="block font-bold text-[#0F172A] mb-1">
                  Message Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message-textarea"
                  rows={4}
                  required
                  placeholder="Please describe your question, market location, or feedback in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting Message...' : 'Submit Contact Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Map Section: Chicago Central MarketLink Operations Office */}
      <section className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                HQ Office: Open & Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Chicago Green Loop Market Operations Office & Coordination Hub
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Located in downtown Chicago along the Green Loop corridor, coordinating farmer supply logistics across 6 community farmers markets.
            </p>
          </div>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=450+N+Michigan+Ave,+Chicago,+IL"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] hover:bg-emerald-100 text-xs font-bold transition shadow-2xs shrink-0"
          >
            <Compass className="w-4 h-4 text-[#16A34A]" />
            <span>Get HQ Directions</span>
          </a>
        </div>

        {/* Embedded Interactive Map */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E2E8DF] shadow-inner bg-slate-100">
          <iframe
            title="MarketLink Central Office Location Map"
            src="https://maps.google.com/maps?q=450%20N%20Michigan%20Ave,%20Chicago,%20IL&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Map Coordinates & Telemetry Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
            <span className="text-[#475569] font-bold block text-[11px] uppercase">Central Address</span>
            <span className="font-bold text-[#0F172A]">450 N Michigan Ave, Chicago, IL 60611</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
            <span className="text-[#475569] font-bold block text-[11px] uppercase">GPS Coordinates</span>
            <span className="font-mono font-bold text-[#16A34A]">41°53'25.4"N 87°37'26.4"W</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
            <span className="text-[#475569] font-bold block text-[11px] uppercase">Metropolitan Market Network</span>
            <span className="font-bold text-[#16A34A]">6 Active Farmers Markets • 180+ Stalls</span>
          </div>
        </div>
      </section>
    </div>
  );
}
