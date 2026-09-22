import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import ambulancesData from '../../data/ambulances.json';
import {
  Ambulance,
  PhoneCall,
  MapPin,
  Navigation,
  AlertTriangle,
  HeartPulse,
  Hospital,
  Activity,
  UserCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

const RESCUE_STAGES = [
  { id: 'pending', label: 'Triage Pending', desc: 'Request logged & verified' },
  { id: 'dispatched', label: 'Unit Dispatched', desc: 'Ambulance assigned' },
  { id: 'en_route', label: 'En Route', desc: 'Vehicle moving to patient' },
  { id: 'arrived', label: 'Arrived On-Scene', desc: 'Paramedics evaluating patient' },
  { id: 'transporting', label: 'Transporting', desc: 'En route to Emergency Room' },
  { id: 'completed', label: 'Care Handover', desc: 'Patient safely admitted' },
];

export default function LiveTrackingPage() {
  const { id } = useParams();
  const { showConfirm, showAlert } = useModal();

  // Find matching ambulance if id matches or default to AMB-CHI-102
  const matchedAmbulance =
    ambulancesData.find(
      (a) =>
        a.vehicleNumber.toLowerCase() === id?.toLowerCase() ||
        a.id.toString() === id
    ) || ambulancesData[1]; // fallback to AMB-CHI-102

  const trackingCode = id?.startsWith('REQ-') ? id : `REQ-2026-${matchedAmbulance.id}892`;

  // Milestone stage state (default en_route: index 2)
  const [currentStageIndex, setCurrentStageIndex] = useState(2);
  const [secondsRemaining, setSecondsRemaining] = useState(328); // ~5 mins 28 secs
  const [speedMph, setSpeedMph] = useState(42);
  const [distanceMiles, setDistanceMiles] = useState(1.4);
  const [requestCancelled, setRequestCancelled] = useState(false);

  // Dynamic countdown timer
  useEffect(() => {
    if (currentStageIndex >= 3 || requestCancelled) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentStageIndex(3); // transition to Arrived On-Scene
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStageIndex, requestCancelled]);

  // Subtle speed fluctuation simulation
  useEffect(() => {
    if (currentStageIndex !== 2 || requestCancelled) return;
    const speedInterval = setInterval(() => {
      setSpeedMph((prev) => Math.min(52, Math.max(34, prev + (Math.floor(Math.random() * 5) - 2))));
    }, 3000);
    return () => clearInterval(speedInterval);
  }, [currentStageIndex, requestCancelled]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStageSimulation = () => {
    if (currentStageIndex < RESCUE_STAGES.length - 1) {
      const nextIdx = currentStageIndex + 1;
      setCurrentStageIndex(nextIdx);
      if (nextIdx === 3) {
        setSecondsRemaining(0);
        setDistanceMiles(0.1);
        setSpeedMph(0);
      } else if (nextIdx === 4) {
        setDistanceMiles(2.8);
        setSecondsRemaining(480);
        setSpeedMph(46);
      } else if (nextIdx === 5) {
        setDistanceMiles(0);
        setSecondsRemaining(0);
        setSpeedMph(0);
      }
    }
  };

  const handleCancelRequest = async () => {
    const confirmed = await showConfirm({
      title: 'Cancel Emergency Dispatch?',
      message:
        'Are you sure you want to recall ambulance unit ' +
        matchedAmbulance.vehicleNumber +
        '? This will immediately alert the Chicago Dispatch room.',
      type: 'danger',
      confirmText: 'Yes, Cancel Incident',
      cancelText: 'Keep En Route',
    });

    if (confirmed) {
      setRequestCancelled(true);
      showAlert({
        title: 'Emergency Dispatch Cancelled',
        message:
          'Incident ' +
          trackingCode +
          ' has been marked as cancelled. The ambulance crew has been instructed to stand down.',
        type: 'warning',
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <section className="bg-[#084298] text-white py-8 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-300 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800">
                Live Incident Telemetry
              </span>
              <span className="text-[11px] font-mono text-blue-200">
                Ref: <strong className="text-white font-bold">{trackingCode}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Emergency Dispatch Real-Time Console</span>
            </h1>
            <p className="text-xs text-blue-100/80">
              Direct telemetry link with Chicago Central Dispatch HQ. Vehicle position and paramedic crew telemetry update continuously.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:03011111234"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white text-xs font-bold transition shadow-md shadow-red-600/30"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Hotline: 030-1111-1234</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Incident Cancelled Notification */}
        {requestCancelled && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#DC3545] text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <strong>Incident Standby:</strong> This emergency call has been cancelled by the user. If you still require urgent medical assistance, please dial <strong>030-1111-1234</strong> immediately.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRequestCancelled(false)}
              className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-[#DC3545] font-bold text-xs shrink-0 cursor-pointer"
            >
              Re-activate Dispatch
            </button>
          </div>
        )}

        {/* Milestone Progress Bar */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0B6EFD]" />
                <span>Rescue Operation Stages</span>
              </h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Current status: <strong className="text-[#0B6EFD] font-bold">{RESCUE_STAGES[currentStageIndex].label}</strong> — {RESCUE_STAGES[currentStageIndex].desc}
              </p>
            </div>

            {/* Stage Simulator Button (Useful for demo & judges) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNextStageSimulation}
                disabled={currentStageIndex >= RESCUE_STAGES.length - 1 || requestCancelled}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0B6EFD] hover:bg-blue-100 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                <span>Simulate Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Steps */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
            {RESCUE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-blue-50/80 border-[#0B6EFD] shadow-xs'
                      : isPast
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                      : 'bg-[#F5F8FC] border-[#E2E8F0] text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        isCurrent
                          ? 'bg-[#0B6EFD] text-white shadow-xs'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div
                      className={`font-bold ${
                        isCurrent
                          ? 'text-[#0B6EFD]'
                          : isPast
                          ? 'text-emerald-800'
                          : 'text-[#1F2A37]'
                      }`}
                    >
                      {stage.label}
                    </div>
                    <div className="text-[10px] text-[#6B7785] line-clamp-1">{stage.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Telemetry & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Map Simulation */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                      GPS Satellite Feed
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1F2A37] mt-0.5">
                    Route Vector: Central Loop Depot ➔ 500 N Michigan Ave
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=500+N+Michigan+Ave,+Chicago,+IL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0] hover:bg-slate-100 text-[#0B6EFD] text-xs font-semibold transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Maps</span>
                  </a>
                </div>
              </div>

              {/* Map Canvas with live telemetry badges */}
              <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100 shadow-inner">
                <iframe
                  title="Ambulance Live Tracking Radar"
                  src="https://maps.google.com/maps?q=450%20N%20Michigan%20Ave,%20Chicago,%20IL&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>

                {/* Overlaid Floating Live Status Tag */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur border border-[#E2E8F0] rounded-xl p-3 shadow-md text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#1F2A37]">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                    <span>Unit #{matchedAmbulance.vehicleNumber} En Route</span>
                  </div>
                  <div className="text-[11px] text-[#6B7785]">
                    Current Sector: <strong className="text-[#1F2A37]">{matchedAmbulance.region}</strong>
                  </div>
                  <div className="text-[11px] text-[#6B7785]">
                    Telemetry Lat/Lng: <span className="font-mono text-[#0B6EFD]">41.8912° N, 87.6241° W</span>
                  </div>
                </div>

                {/* Overlaid ETA Box */}
                <div className="absolute bottom-4 right-4 bg-[#084298]/95 backdrop-blur text-white border border-blue-400/30 rounded-xl p-3 shadow-lg text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                    Target ETA
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-300">
                    {secondsRemaining > 0 ? formatTimer(secondsRemaining) : 'ARRIVED'}
                  </div>
                  <div className="text-[10px] text-blue-200">
                    Distance: <strong className="text-white">{distanceMiles} miles</strong>
                  </div>
                </div>
              </div>

              {/* Waypoints Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#6B7785] font-bold uppercase tracking-wider block">
                    Starting Depot
                  </span>
                  <div className="font-bold text-[#1F2A37] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B6EFD]" />
                    <span>Chicago Central Command HQ</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#6B7785] font-bold uppercase tracking-wider block">
                    Pickup Location
                  </span>
                  <div className="font-bold text-[#1F2A37] flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-[#DC3545]" />
                    <span>500 N Michigan Ave, Chicago</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#6B7785] font-bold uppercase tracking-wider block">
                    Assigned Hospital
                  </span>
                  <div className="font-bold text-[#1F2A37] flex items-center gap-1.5">
                    <Hospital className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Northwestern Memorial Hospital</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Safety Protocol While Waiting */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Critical Safety Guidance While Waiting for Paramedics</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900/90 pt-1">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Clear Access:</strong> Unlock the front door, turn on porch lights, and clear driveway obstacles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Keep Line Open:</strong> Keep your registered mobile phone free in case the driver or dispatcher calls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Medical Dossier:</strong> Gather patient medication lists, known allergies, and insurance/ID cards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Keep Patient Still:</strong> Maintain a calm posture and do not administer food or drink unless instructed by 911.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Driver Telemetry, Vehicle Specs & Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live ETA Card */}
            <div className="bg-gradient-to-br from-[#084298] to-[#0B6EFD] text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between text-xs text-blue-200 border-b border-white/15 pb-2">
                <span>Estimated Arrival</span>
                <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Transponder
                </span>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow">
                  {secondsRemaining > 0 ? formatTimer(secondsRemaining) : 'ON SCENE'}
                </div>
                <p className="text-xs text-blue-100">
                  {secondsRemaining > 0
                    ? 'Minutes until paramedic team reaches your door'
                    : 'Paramedics have arrived at your designated location'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-center">
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur">
                  <span className="text-[10px] text-blue-200 block uppercase">Speed</span>
                  <span className="font-bold text-base text-white">{speedMph} mph</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur">
                  <span className="text-[10px] text-blue-200 block uppercase">Distance</span>
                  <span className="font-bold text-base text-white">{distanceMiles} mi</span>
                </div>
              </div>
            </div>

            {/* Crew & Unit Profile Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="text-sm font-bold text-[#1F2A37] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#0B6EFD]" />
                  <span>Assigned Paramedic Crew</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#0B6EFD] font-bold border border-blue-200">
                  Team Alpha
                </span>
              </div>

              {/* Driver Details */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1F2A37]">Marcus Vance</div>
                    <div className="text-[11px] text-[#6B7785]">Chief Emergency Driver (8 yrs exp)</div>
                  </div>
                  <a
                    href="tel:0912345678"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold border border-emerald-200 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="font-bold text-[#1F2A37]">Sarah Jenkins, EMT-P</div>
                    <div className="text-[11px] text-[#6B7785]">Lead Critical Care Paramedic</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                    ALS Certified
                  </span>
                </div>
              </div>

              {/* Ambulance Specs Summary */}
              <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7785]">Vehicle Number:</span>
                  <span className="font-mono font-bold text-[#1F2A37]">
                    {matchedAmbulance.vehicleNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7785]">Model / Chassis:</span>
                  <span className="font-semibold text-[#1F2A37] text-right line-clamp-1">
                    {matchedAmbulance.model}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7785]">Classification:</span>
                  <span className="font-bold text-[#0B6EFD]">
                    {matchedAmbulance.type} ({matchedAmbulance.size})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7785]">Equipment Level:</span>
                  <span className="text-emerald-700 font-semibold">Advanced Life Support (ALS)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7785]">
                Dispatch Actions
              </h4>

              <div className="space-y-2">
                <Link
                  to={`/ambulances/${matchedAmbulance.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F5F8FC] hover:bg-slate-100 border border-[#E2E8F0] text-[#1F2A37] font-bold text-xs transition"
                >
                  <Ambulance className="w-4 h-4 text-[#0B6EFD]" />
                  <span>Inspect Vehicle Full Specs</span>
                </Link>

                <button
                  type="button"
                  onClick={handleCancelRequest}
                  disabled={requestCancelled || currentStageIndex >= 5}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-[#DC3545] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cancel Emergency Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
