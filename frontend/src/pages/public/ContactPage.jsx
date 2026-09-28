import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { contactApi } from '../../api';
import ContactInfoSidebar from '../../components/contact/ContactInfoSidebar';
import ContactMapSection from '../../components/contact/ContactMapSection';

export default function ContactPage() {
  const { showAlert } = useModal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Pre-Order Question');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
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
    try {
      await contactApi.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: topic,
        message: message.trim(),
      });

      setSent(true);
      showAlert({
        title: 'Inquiry Dispatched',
        message: 'Your message has been delivered to the MarketLink operations office. We will reply to your email within 24-48 hours!',
        type: 'success',
        confirmText: 'Great',
      });
    } catch (err) {
      showAlert({
        title: 'Submission Failed',
        message: err?.response?.data?.message || 'Could not deliver your inquiry. Please verify your details and try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
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
        {/* Left Col: Contact Info (Delegated) */}
        <ContactInfoSidebar />

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
                onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition cursor-pointer shadow-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Send Us a Direct Message</h2>
                <p className="text-xs text-[#475569] mb-4">Open to all shoppers, family growers, market volunteers, and community food partners.</p>
              </div>

              <div>
                <label htmlFor="contact-full-name-input" className="block font-bold text-[#0F172A] mb-1">Your Full Name <span className="text-rose-500">*</span></label>
                <input id="contact-full-name-input" type="text" required placeholder="e.g. Sarah Jenkins" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" />
              </div>

              <div>
                <label htmlFor="contact-email-input" className="block font-bold text-[#0F172A] mb-1">Email Address <span className="text-rose-500">*</span></label>
                <input id="contact-email-input" type="email" required placeholder="e.g. sarah@prairieorganics.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden" />
              </div>

              <div>
                <label htmlFor="contact-topic-select" className="block font-bold text-[#0F172A] mb-1">Inquiry Topic</label>
                <select id="contact-topic-select" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden">
                  <option value="Pre-Order Question">Weekend Pre-Order & Stall Pickup Question</option>
                  <option value="Stall Vendor Application">Farmer Stall Application & Permit Inquiries</option>
                  <option value="Volunteer Opportunity">Volunteer Tote Packing & Market Support</option>
                  <option value="SNAP/LINK Matching">SNAP / LINK Food Assistance Matching Coupons</option>
                  <option value="General Inquiries">General Market Question or Community Suggestion</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message-textarea" className="block font-bold text-[#0F172A] mb-1">Message Content <span className="text-rose-500">*</span></label>
                <textarea id="contact-message-textarea" rows={4} required placeholder="Please describe your question, market location, or feedback in detail..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden leading-relaxed"></textarea>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 mt-2">
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting Message...' : 'Submit Contact Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Section (Delegated) */}
      <ContactMapSection />
    </div>
  );
}
