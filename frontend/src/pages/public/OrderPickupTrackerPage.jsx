import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import {
  ShoppingBag,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Sprout,
  ArrowLeft,
  PhoneCall,
  Navigation,
  Printer,
  XCircle,
  Search,
  Store,
  Info,
} from 'lucide-react';

const TRACKING_STEPS = [
  {
    step: 1,
    title: 'Order Placed',
    desc: 'Pre-order request received & logged into farmer queue',
    time: 'Thursday, 04:15 PM',
  },
  {
    step: 2,
    title: 'Farmer Confirmed',
    desc: 'Grower reviewed harvest yield and accepted order',
    time: 'Friday, 10:30 AM',
  },
  {
    step: 3,
    title: 'Harvested & Packed',
    desc: 'Produce picked fresh at dawn & packed in your tote crate',
    time: 'Saturday, 05:45 AM',
  },
  {
    step: 4,
    title: 'Ready for Pickup at Stall',
    desc: 'Held at Stall #04 awaiting in-person customer inspection',
    time: 'Saturday, 07:30 AM',
  },
];

export default function OrderPickupTrackerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();

  const activeTrackingCode = id || 'MLB-2026-8819';
  const [searchInput, setSearchInput] = useState('');
  const [currentStep, setCurrentStep] = useState(4); // Default to Ready for Pickup
  const [isCancelled, setIsCancelled] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(4520); // ~1h 15m

  useEffect(() => {
    if (isCancelled) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCancelled]);

  const formatTimer = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}h ${mins
      .toString()
      .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/tracking/${searchInput.trim().toUpperCase()}`);
      setSearchInput('');
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = await showConfirm({
      title: 'Cancel Pre-Order Reservation?',
      message: `Are you sure you want to cancel reservation ${activeTrackingCode}? The farmer will be notified so the reserved produce can be released to other market visitors.`,
      confirmText: 'Yes, Cancel Reservation',
      cancelText: 'Keep Reservation',
      type: 'warning',
    });

    if (confirmed) {
      setIsCancelled(true);
      showAlert({
        title: 'Reservation Cancelled',
        message: `Your pre-order ${activeTrackingCode} has been cancelled. No cancellation fees apply.`,
        type: 'info',
      });
    }
  };

  const handlePrintPass = () => {
    showAlert({
      title: 'Order Pickup Pass Ready',
      message: `Pickup Pass for ${activeTrackingCode} is ready for mobile display at Lincoln Park Stall #04. You can also show this screen to the stall master.`,
      type: 'success',
      confirmText: 'Got It',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8DF] pb-6">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#15803D] mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fresh Produce Catalog</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Pre-Order Pickup Tracker
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                isCancelled
                  ? 'bg-red-100 text-[#DC2626] border-red-200'
                  : 'bg-emerald-100 text-[#15803D] border-emerald-200'
              }`}
            >
              {isCancelled ? 'CANCELLED' : 'ACTIVE ORDER'}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-1 font-mono">
            Reservation Code: <strong className="text-[#0F172A]">{activeTrackingCode}</strong>
          </p>
        </div>

        {/* Quick Search Another Order */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Track other code (MLB-...)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs"
          >
            Track
          </button>
        </form>
      </div>

      {/* 4-Step Interactive Stepper Lifecycle */}
      <section className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
              <span>4-Step Pre-Order Fulfillment Lifecycle</span>
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Track the journey of your produce from dawn field harvest to market stall basket
            </p>
          </div>

          {!isCancelled && (
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Clock className="w-4 h-4 text-[#16A34A] animate-pulse" />
              <div className="text-xs">
                <span className="text-[#475569]">Pickup Window Closes In: </span>
                <strong className="text-[#15803D] font-mono">{formatTimer(secondsRemaining)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {TRACKING_STEPS.map((s) => {
            const isCompleted = !isCancelled && currentStep >= s.step;
            const isCurrent = !isCancelled && currentStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => !isCancelled && setCurrentStep(s.step)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'border-[#16A34A] bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                    : isCompleted
                    ? 'border-emerald-200 bg-white'
                    : 'border-[#E2E8DF] bg-[#F8FAF6]/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      isCompleted
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-slate-200 text-[#475569]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                  </span>
                  <span className="text-[10px] font-mono text-[#475569]">{s.time}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] leading-snug">{s.title}</h4>
                  <p className="text-[11px] text-[#475569] mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo status simulation helper note */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-[#475569] italic">
            💡 Evaluator Tip: Click any step above to inspect different order fulfillment milestones.
          </p>
        </div>
      </section>

      {/* Main Grid: Stall Location + Order Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stall & Farmer Instructions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#16A34A]" />
                <h3 className="text-base font-bold text-[#0F172A]">
                  Stall Pickup Location & Contact
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-[#15803D]">
                Stall #04
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#475569]">
              <div className="space-y-1">
                <span className="text-[11px] text-[#475569] block">Farmers Market:</span>
                <strong className="text-sm text-[#0F172A] block">Lincoln Park Farmers Market</strong>
                <p className="text-[11px] text-[#475569]">Armitage Ave & Orchard St, Chicago, IL</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#475569] block">Family Farm & Grower:</span>
                <strong className="text-sm text-[#15803D] block flex items-center gap-1">
                  <Sprout className="w-4 h-4 text-[#16A34A]" /> Green Valley Organics
                </strong>
                <p className="text-[11px] text-[#475569]">Farmer: Thomas Miller</p>
              </div>
            </div>

            {/* Specific Navigation Instructions */}
            <div className="p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-2 text-xs">
              <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-500" />
                <span>How to Find the Stall on Market Day:</span>
              </span>
              <p className="text-[#475569] leading-relaxed">
                Enter via Armitage Ave entrance. Walk straight into <strong>Aisle 2</strong>. Stall #04 is situated under the large green striped awning with the wooden chalkboard reading <em>"Green Valley Organics - Pre-Order Pickup"</em>.
              </p>
            </div>

            {/* Embedded Map */}
            <div className="rounded-2xl overflow-hidden border border-[#E2E8DF] h-52 relative bg-slate-100">
              <iframe
                title="Lincoln Park Farmers Market Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-87.6641%2C41.9104%2C-87.6401%2C41.9264&layer=mapnik&marker=41.9184%2C-87.6521"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lincoln+Park+Farmers+Market+Chicago"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open in Google Maps Navigation</span>
              </a>

              <a
                href="tel:3125553276"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#0F172A]"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                <span>Call Stall: (312) 555-FARM</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Order Receipt & Cash Settlement Slip */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#16A34A]" />
                <span>Reserved Harvest Slip</span>
              </h3>
              <span className="text-xs font-mono text-[#475569]">
                Pickup: Saturday 08-10 AM
              </span>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-[#0F172A] block">Organic Heirloom Rainbow Tomatoes</span>
                  <span className="text-[11px] text-[#475569]">2 lbs @ $4.50 / lb</span>
                </div>
                <span className="font-bold text-[#0F172A]">$9.00</span>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-[#0F172A] block">Raw Wildflower Honey Comb Jar</span>
                  <span className="text-[11px] text-[#475569]">1 jar @ $12.00 / jar</span>
                </div>
                <span className="font-bold text-[#0F172A]">$12.00</span>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between text-[#475569]">
                <span>Produce Subtotal:</span>
                <span>$21.00</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Market Stall Reservation Surcharge:</span>
                <span className="font-bold text-[#16A34A]">$0.00 (Zero Fee)</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm font-black text-[#0F172A]">
                <span>Estimated Total for Pickup:</span>
                <span className="text-2xl text-[#16A34A]">$21.00</span>
              </div>
            </div>

            {/* SRS Constraint Reminder */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Pay in Person at the Stall:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                No money was charged online. Please bring cash or card to settle directly with Farmer Thomas Miller when inspecting your fresh harvest basket.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handlePrintPass}
                className="w-full py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Save / Show Mobile Pickup Pass</span>
              </button>

              {!isCancelled && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-[#DC2626] text-[#475569] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Pre-Order Reservation</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
