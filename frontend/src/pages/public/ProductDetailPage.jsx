import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import productsData from '../../data/products.json';
import {
  ArrowLeft,
  Sprout,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Star,
  Clock,
  Calendar,
  Plus,
  Minus,
  Info,
  Phone,
  User,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useModal();

  // Lookup product by id
  const product = productsData.find(
    (p) => p.id.toString() === id || p.slug === id
  );

  const [quantity, setQuantity] = useState(1);
  const [pickupDay, setPickupDay] = useState('This Saturday (08:00 AM - 01:00 PM)');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('08:00 AM - 10:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#0F172A]">Produce Item Not Found</h1>
        <p className="text-xs text-[#475569]">
          The requested harvest listing identifier <code className="font-bold">{id}</code> could not be found.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Produce Catalog</span>
        </Link>
      </div>
    );
  }

  const handleDemoFill = () => {
    setCustomerName('Eleanor Vance');
    setCustomerPhone('(312) 888-4521');
    setNotes('Please select medium-sized pieces ready for weekend family dinner.');
    setPickupTimeSlot('08:00 AM - 10:00 AM');
    setQuantity(2);
    setError('');
  };

  const handlePreOrderSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Please provide your name and phone number for stall pickup verification.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const generatedOrderCode = `MLB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalEstimated = (quantity * product.price).toFixed(2);

      showAlert({
        title: 'Pre-Order Confirmed for Stall Pickup!',
        message: `Your reservation code is ${generatedOrderCode}. ${quantity} ${product.unit} of "${product.name}" has been reserved at ${product.marketName} (${product.stallNumber} - ${product.farmOrigin}). Total estimated: $${totalEstimated} (payable in person via cash or card at the stall).`,
        type: 'success',
        confirmText: 'Go to Order Tracker',
      }).then(() => {
        navigate(`/tracking/${generatedOrderCode}`);
      });
    }, 500);
  };

  const totalAmount = (quantity * product.price).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#15803D] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fresh Produce Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Showcase & Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Showcase */}
          <div className="bg-white border border-[#E2E8DF] rounded-3xl overflow-hidden shadow-xs">
            <div className="h-80 sm:h-96 relative bg-slate-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.isOrganic && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-800 text-white backdrop-blur shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{product.certificationBadge}</span>
                  </span>
                )}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/70 text-white backdrop-blur">
                  {product.category}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-white/95 backdrop-blur text-xs font-bold text-amber-700 flex items-center gap-1.5 shadow-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{product.rating}</span>
                <span className="text-[#475569] font-normal">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs text-[#475569] mb-1">
                  <span className="font-semibold text-[#15803D] flex items-center gap-1">
                    <Sprout className="w-4 h-4 text-[#16A34A]" />
                    {product.farmOrigin}
                  </span>
                  <span className="font-mono font-bold bg-emerald-50 text-[#15803D] px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {product.stallNumber}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#16A34A]">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-[#475569] font-semibold">
                    per {product.unit} (Direct Farm Price)
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {product.description}
              </p>

              {/* Farm Origin & Location Card */}
              <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Farm Origin & Stall Coordinates</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#475569]">
                  <div>
                    <span className="block text-[11px] text-[#475569]">Grower / Farmer:</span>
                    <strong className="text-[#0F172A]">{product.farmerName}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#475569]">Farm Location:</span>
                    <strong className="text-[#0F172A]">{product.farmLocation}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#475569]">Weekend Market:</span>
                    <strong className="text-[#0F172A]">{product.marketName}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#475569]">Stock Remaining:</span>
                    <strong className="text-emerald-700">{product.stockQuantity} {product.unit}s available</strong>
                  </div>
                </div>
              </div>

              {/* Harvest & Freshness Insights */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Harvest & Storage Guidelines</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Harvest Timestamp:</span>
                    <p className="text-[11px] text-[#475569]">{product.harvestNote}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Home Storage Tip:</span>
                    <p className="text-[11px] text-[#475569]">{product.storageTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Order for Pickup Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
                  <span>Pre-Order for Pickup</span>
                </h2>
                <p className="text-xs text-[#475569] mt-0.5">
                  Reserve fresh stock ahead for weekend market day
                </p>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] font-bold text-[#16A34A] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
              >
                1-Click Demo Fill
              </button>
            </div>

            {/* SRS Constraint Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-[#15803D] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>No Online Payment Needed</strong>: As per farmers market guidelines, settle in person with cash or card at <strong>{product.stallNumber}</strong> upon inspecting your produce basket.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handlePreOrderSubmit} className="space-y-4">
              {/* Market Day Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Market Pickup Date</span>
                </label>
                <select
                  value={pickupDay}
                  onChange={(e) => setPickupDay(e.target.value)}
                  className="w-full text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 font-medium text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
                >
                  <option value="This Saturday (08:00 AM - 01:00 PM)">
                    This Saturday, Upcoming Market Day (08:00 AM - 01:00 PM)
                  </option>
                  <option value="This Sunday (08:30 AM - 02:00 PM)">
                    This Sunday, Weekend Session (08:30 AM - 02:00 PM)
                  </option>
                  <option value="Next Saturday (08:00 AM - 01:00 PM)">
                    Next Saturday (Advance Harvest Reservation)
                  </option>
                </select>
              </div>

              {/* Pickup Time Slot Radio Window */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Select Stall Pickup Window</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { slot: '08:00 AM - 10:00 AM', label: 'Early Harvest Pickup (Freshest Morning Selection)' },
                    { slot: '10:00 AM - 12:00 PM', label: 'Midday Market Window (Peak Vibrancy)' },
                    { slot: '12:00 PM - 02:00 PM', label: 'Afternoon Pickup (Before Market Close)' },
                  ].map((item) => (
                    <label
                      key={item.slot}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        pickupTimeSlot === item.slot
                          ? 'border-[#16A34A] bg-emerald-50/60 font-semibold text-[#0F172A]'
                          : 'border-[#E2E8DF] hover:bg-slate-50 text-[#475569]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickupSlot"
                        value={item.slot}
                        checked={pickupTimeSlot === item.slot}
                        onChange={() => setPickupTimeSlot(item.slot)}
                        className="mt-0.5 text-[#16A34A] focus:ring-[#16A34A]"
                      />
                      <div>
                        <div className="font-bold text-[#0F172A]">{item.slot}</div>
                        <div className="text-[11px] text-[#475569]">{item.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>Quantity ({product.unit}s):</span>
                  <span className="text-[#16A34A] font-bold">
                    Max: {product.stockQuantity} {product.unit}s
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-[#0F172A] flex items-center justify-center font-bold text-sm transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center font-black text-base text-[#0F172A] bg-[#F8FAF6] border border-[#E2E8DF] py-2 rounded-xl">
                    {quantity} <span className="text-xs font-normal text-[#475569]">{product.unit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    disabled={quantity >= product.stockQuantity}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-[#0F172A] flex items-center justify-center font-bold text-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Your Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Sarah Jenkins"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Mobile Phone (for Stall Pickup SMS/Pass)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g. (312) 555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0F172A] block">
                    Special Notes for Stall Master (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g. Please pick slightly ripe pieces; will bring my own tote bag."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl px-3.5 py-2 text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Dynamic Estimated Total Calculation */}
              <div className="pt-3 border-t border-[#E2E8DF] bg-[#F8FAF6] -mx-6 -mb-6 p-6 rounded-b-3xl space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#475569]">
                    <span>Item Price:</span>
                    <span>${product.price.toFixed(2)} × {quantity}</span>
                  </div>
                  <div className="flex justify-between text-[#475569]">
                    <span>Market Pickup Surcharge:</span>
                    <span className="text-[#16A34A] font-bold">$0.00 (Free Pickup)</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#0F172A] pt-2 border-t border-slate-200">
                    <span>Estimated Total:</span>
                    <span className="text-xl text-[#16A34A]">${totalAmount}</span>
                  </div>
                  <p className="text-[10px] text-[#475569] italic">
                    Payable directly to {product.farmerName} upon pickup at {product.stallNumber}.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {submitting ? 'Confirming Pre-Order...' : 'Confirm Pre-Order (Pay at Stall)'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
