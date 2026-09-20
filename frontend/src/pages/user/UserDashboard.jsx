import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UserDashboard() {
  const { user } = useAuth();
  const [sosActive, setSosActive] = useState(false);

  const handleTriggerSOS = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Confirm Emergency SOS',
      text: 'Are you sure you want to broadcast your GPS coordinates to Chicago Emergency Dispatch?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send Ambulance Immediately',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#DC3545',
    }).then((result) => {
      if (result.isConfirmed) {
        setSosActive(true);
        Swal.fire({
          icon: 'success',
          title: 'SOS Beacon Broadcasted!',
          text: 'Operator has received your beacon. Nearest ambulance unit (Unit #102) is being dispatched.',
          timer: 2500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
            Patient Portal
          </span>
          <h1 className="text-2xl font-black text-[#1F2A37] mt-2">
            Hello, {user?.fullname || 'Patient'}
          </h1>
          <p className="text-xs text-[#6B7785] mt-1">
            Registered phone: <strong className="text-[#1F2A37]">{user?.phone || '0903456789'}</strong> • Email: {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/feedback"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Submit Feedback</span>
          </Link>
        </div>
      </div>

      {/* Main 1-Touch SOS Trigger Card */}
      <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-3xl p-6 sm:p-10 shadow-md text-center space-y-6">
        <div className="max-w-md mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-100 text-[#DC3545]">
            One-Touch Emergency Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1F2A37]">
            Need Emergency Medical Assistance?
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7785] leading-relaxed">
            Pressing the button below instantly captures your browser GPS coordinates and flags the nearest certified eAmbulance.
          </p>
        </div>

        {/* Big Red Button */}
        <div className="py-4">
          <button
            type="button"
            onClick={handleTriggerSOS}
            className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#DC3545] hover:bg-red-700 text-white font-black text-lg sm:text-xl shadow-2xl shadow-red-600/40 transition transform hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center mx-auto border-8 border-white group"
          >
            <HeartPulse className="w-12 h-12 mb-2 animate-pulse group-hover:scale-110 transition" />
            <span>TRIGGER</span>
            <span className="text-2xl font-black tracking-widest text-amber-200">SOS</span>
          </button>
        </div>

        {sosActive && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-3 max-w-lg mx-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-left">
              <strong>Live Beacon Transmitting:</strong> Unit AMB-CHI-102 (Ford Transit ICU) is en route to your location. Estimated arrival: <strong>6 minutes</strong>.
            </div>
          </div>
        )}

        <div className="text-xs text-[#6B7785] flex items-center justify-center gap-2 pt-2">
          <PhoneCall className="w-4 h-4 text-[#DC3545]" />
          <span>Or dial direct emergency hotline: <strong className="text-[#1F2A37]">030-1111-1234</strong></span>
        </div>
      </div>

      {/* Recent Transport Records Preview */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-bold text-[#1F2A37]">Recent Care Records</h3>
            <p className="text-xs text-[#6B7785]">History of emergency dispatches and completed patient transports</p>
          </div>
        </div>

        <div className="border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#1F2A37]">SOS-2026-081</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Completed
              </span>
              <span className="text-[#6B7785]">Sept 18, 2026</span>
            </div>
            <div className="text-[#1F2A37] font-semibold">Transport from Michigan Ave to Northwestern Memorial Hospital</div>
            <div className="text-[#6B7785]">Unit: AMB-CHI-101 (Mercedes Sprinter ICCU) • Paramedic Team Alpha</div>
          </div>

          <Link
            to="/feedback"
            className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0B6EFD] font-bold text-xs hover:bg-blue-100 transition"
          >
            Review Service
          </Link>
        </div>
      </div>
    </div>
  );
}
