import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import ambulancesData from '../../data/ambulances.json';
import {
  ArrowLeft,
  Ambulance,
  MapPin,
  ShieldCheck,
  Send,
  Sparkles,
  PhoneCall,
  Activity,
  HeartPulse,
  SlidersHorizontal,
  Hospital,
  AlertTriangle,
} from 'lucide-react';

export default function AmbulanceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useModal();

  // Lookup ambulance by id or vehicleNumber
  const ambulance = ambulancesData.find(
    (a) =>
      a.id.toString() === id ||
      a.vehicleNumber.toLowerCase() === id?.toLowerCase()
  );

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [condition, setCondition] = useState('');
  const [destinationHospital, setDestinationHospital] = useState(
    'Northwestern Memorial Hospital'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!ambulance) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#DC3545] flex items-center justify-center mx-auto">
          <Ambulance className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#1F2A37]">Ambulance Unit Not Found</h1>
        <p className="text-xs text-[#6B7785]">
          The emergency vehicle identifier <code className="font-bold">{id}</code> could not be located in our fleet registry.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B6EFD] text-white text-xs font-bold hover:bg-[#084298] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Fleet Catalog</span>
        </Link>
      </div>
    );
  }

  const handleDemoFill = () => {
    setPatientName('Eleanor Vance');
    setPatientPhone('0918-777-666');
    setPickupAddress('500 N Michigan Ave, Apt 14B, Chicago, IL 60611');
    setCondition('Severe acute chest pain and oxygen saturation dropped to 88%');
    setDestinationHospital('Northwestern Memorial Hospital');
    setError('');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !pickupAddress.trim() || !condition.trim()) {
      setError('Please provide all patient, pickup, and condition details.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showAlert({
        title: 'Emergency Dispatch Confirmed!',
        message: `Unit ${ambulance.vehicleNumber} (${ambulance.model}) has been locked and routed to ${pickupAddress}. Crew assigned: Paramedic Team Alpha. Destination: ${destinationHospital}. ETA: 6 mins.`,
        type: 'success',
        confirmText: 'Go to Tracking Console',
      }).then(() => {
        navigate(`/tracking/${ambulance.vehicleNumber}`);
      });
    }, 600);
  };

  // Image mappings
  const getImageForType = (type) => {
    switch (type) {
      case 'ICCU':
        return 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80';
      case 'ICU':
        return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80';
      case 'A/C':
        return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80';
      default:
        return 'https://images.unsplash.com/photo-1612838320302-4b3b49be9484?auto=format&fit=crop&w=1200&q=80';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E2E8F0]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0B6EFD] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Catalog</span>
        </Link>

        <div className="text-xs text-[#6B7785] flex items-center gap-2">
          <span>Catalog</span>
          <span>/</span>
          <span>{ambulance.region}</span>
          <span>/</span>
          <span className="font-mono font-bold text-[#1F2A37]">{ambulance.vehicleNumber}</span>
        </div>
      </div>

      {/* Main 2-Column Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vehicle Specifications & Medical Capabilities (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
              <img
                src={getImageForType(ambulance.type)}
                alt={ambulance.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Status and Class Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  Ready for Immediate Dispatch
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                    ambulance.type === 'ICCU'
                      ? 'bg-purple-600 text-white'
                      : ambulance.type === 'ICU'
                      ? 'bg-blue-600 text-white'
                      : ambulance.type === 'A/C'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {ambulance.type} Class
                </span>
              </div>

              {/* Bottom Details on Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="font-mono text-xs text-blue-200 uppercase tracking-widest font-bold block">
                  Identifier: {ambulance.vehicleNumber}
                </span>
                <h1 className="text-xl sm:text-2xl font-black">{ambulance.model}</h1>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E2E8F0] border-t border-[#E2E8F0] bg-[#F5F8FC]/60 text-xs">
              <div className="p-4 text-center">
                <span className="text-[#6B7785] block text-[11px]">Standard Trip Rate</span>
                <span className="text-lg font-black text-[#0B6EFD]">${ambulance.price}</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-[#6B7785] block text-[11px]">Response Sector</span>
                <span className="font-bold text-[#1F2A37] block mt-0.5">{ambulance.region}</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-[#6B7785] block text-[11px]">Vehicle Body Size</span>
                <span className="font-bold text-[#1F2A37] block mt-0.5">{ambulance.size}</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-[#6B7785] block text-[11px]">Est. Sector Arrival</span>
                <span className="font-bold text-emerald-700 block mt-0.5">5 – 7 Mins</span>
              </div>
            </div>
          </div>

          {/* Clinical Equipment Inventory */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <HeartPulse className="w-5 h-5 text-[#DC3545]" />
              <h2 className="text-base font-bold text-[#1F2A37]">
                On-Board Critical Care & Resuscitation Equipment
              </h2>
            </div>

            <p className="text-xs text-[#6B7785] leading-relaxed">
              Certified under Illinois Emergency Medical Services Level 1 specifications. This unit carries comprehensive hospital-grade life support instrumentation:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                <Activity className="w-4 h-4 text-[#0B6EFD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1F2A37] block">Multi-Parameter ECG Monitor</span>
                  <span className="text-[#6B7785] text-[11px]">12-lead telemetry transmitted directly to trauma center.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-3">
                <HeartPulse className="w-4 h-4 text-[#DC3545] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1F2A37] block">Biphasic Defibrillator</span>
                  <span className="text-[#6B7785] text-[11px]">Automated external & synchronized cardioversion pacemakers.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-3">
                <SlidersHorizontal className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1F2A37] block">Invasive/Non-Invasive Ventilator</span>
                  <span className="text-[#6B7785] text-[11px]">Dedicated O2 concentrator with CPAP & BiPAP support.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1F2A37] block">Hydro-Pneumatic Stretcher</span>
                  <span className="text-[#6B7785] text-[11px]">Vibration isolation and power-load shock absorption.</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-[11px] text-[#6B7785] flex items-center justify-between">
              <span>Station Base Depot: <strong>Chicago Medical District Depot 2</strong></span>
              <span className="text-emerald-700 font-bold">100% Inspected & Certified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Dispatch Request Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#DC3545] bg-red-50 px-2.5 py-1 rounded border border-red-200">
                Direct Unit Dispatch
              </span>
              <button
                type="button"
                onClick={handleDemoFill}
                className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded font-bold transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Demo Fill</span>
              </button>
            </div>
            <h2 className="text-lg font-bold text-[#1F2A37] mt-2">
              Dispatch This Emergency Unit
            </h2>
            <p className="text-xs text-[#6B7785]">
              Request immediate allocation of Unit <strong className="text-[#1F2A37] font-mono">{ambulance.vehicleNumber}</strong> to your incident address.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#DC3545] text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Patient Full Name <span className="text-[#DC3545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Emergency Contact Phone <span className="text-[#DC3545]">*</span>
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-[#6B7785] absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0918-777-666"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                />
              </div>
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Incident / Pickup Address <span className="text-[#DC3545]">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#0B6EFD] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 N Michigan Ave, Apt 14B, Chicago, IL"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                />
              </div>
            </div>

            {/* Destination Hospital */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Preferred Destination Hospital
              </label>
              <div className="relative">
                <Hospital className="w-4 h-4 text-[#6B7785] absolute left-3 top-3" />
                <select
                  value={destinationHospital}
                  onChange={(e) => setDestinationHospital(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                >
                  <option value="Northwestern Memorial Hospital">Northwestern Memorial Hospital (Downtown)</option>
                  <option value="Rush University Medical Center">Rush University Medical Center</option>
                  <option value="University of Chicago Medical Center">University of Chicago Medical Center (South)</option>
                  <option value="Advocate Illinois Masonic Medical Center">Advocate Illinois Masonic (North)</option>
                  <option value="Mount Sinai Hospital Chicago">Mount Sinai Hospital Chicago (West)</option>
                </select>
              </div>
            </div>

            {/* Medical Condition */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Triage / Patient Condition Summary <span className="text-[#DC3545]">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe visible symptoms, trauma degree, conscious state, or breathing difficulty..."
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] leading-relaxed"
              ></textarea>
            </div>

            {/* Pricing Summary (No Checkout per SRS) */}
            <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#6B7785]">
                <span>Base Dispatch Allocation:</span>
                <span className="font-bold text-[#1F2A37]">${ambulance.price}.00</span>
              </div>
              <div className="flex items-center justify-between text-[#6B7785]">
                <span>On-board ICU Life Support:</span>
                <span className="text-emerald-600 font-bold">Covered ($0.00)</span>
              </div>
              <div className="pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#1F2A37]">
                <span>Estimated Charge:</span>
                <span className="text-sm font-black text-[#0B6EFD]">${ambulance.price}.00</span>
              </div>
              <p className="text-[10px] text-[#6B7785] pt-0.5">
                * Zero upfront online checkout required. Invoicing handled post-transport per LifeLink SRS guidelines.
              </p>
            </div>

            {/* Dispatch CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting To Dispatch...' : 'Confirm Emergency Dispatch'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
