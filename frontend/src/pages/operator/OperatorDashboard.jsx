import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Ambulance,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Send,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function OperatorDashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([
    {
      id: 'SOS-2026-001',
      patientName: 'Sarah Jenkins',
      patientPhone: '0912-345-678',
      pickupAddress: '450 N Michigan Ave, Chicago, IL',
      condition: 'Acute chest pain and severe respiratory distress',
      status: 'pending',
      assignedAmbulance: null,
      time: '2 mins ago',
    },
    {
      id: 'SOS-2026-002',
      patientName: 'Michael Chang',
      patientPhone: '0918-987-654',
      pickupAddress: '233 S Wacker Dr (Willis Tower), Chicago, IL',
      condition: 'Trauma from construction fall, fractured leg',
      status: 'assigned',
      assignedAmbulance: 'AMB-CHI-102 (Ford Transit ICU)',
      time: '6 mins ago',
    },
  ]);

  const handleAssign = (requestId) => {
    Swal.fire({
      title: 'Assign Ambulance',
      text: 'Select available vehicle to dispatch for ' + requestId,
      input: 'select',
      inputOptions: {
        'AMB-CHI-101': 'AMB-CHI-101 (Mercedes Mobile ICCU - $25)',
        'AMB-CHI-102': 'AMB-CHI-102 (Ford Transit ALS ICU - $20)',
        'AMB-CHI-103': 'AMB-CHI-103 (Chevrolet Express A/C - $15)',
      },
      showCancelButton: true,
      confirmButtonText: 'Dispatch Unit',
      confirmButtonColor: '#0B6EFD',
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: 'assigned',
                  assignedAmbulance: result.value,
                }
              : req
          )
        );
        Swal.fire({
          icon: 'success',
          title: 'Ambulance Dispatched!',
          text: `Unit ${result.value} has received GPS route to incident site.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Station Overview */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
            Station Status: Operational
          </span>
          <h1 className="text-2xl font-black text-[#1F2A37] mt-2">
            Live Dispatch Queue & Call Monitor
          </h1>
          <p className="text-xs text-[#6B7785] mt-1">
            Logged in as Dispatcher: <strong className="text-[#1F2A37]">{user?.fullname}</strong> • Active Frequency 148.55 MHz
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>GPS Tracking Live</span>
          </span>
        </div>
      </div>

      {/* Live Request Queue */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Active Emergency SOS Incidents</span>
            </h2>
            <p className="text-xs text-[#6B7785]">Incoming patient beacons requiring ambulance fleet allocation</p>
          </div>
          <span className="text-xs font-bold text-[#DC3545] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            {requests.filter((r) => r.status === 'pending').length} Action Required
          </span>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`border rounded-2xl p-5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                req.status === 'pending'
                  ? 'border-red-300 bg-red-50/40'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#1F2A37] bg-slate-100 px-2 py-0.5 rounded">
                    {req.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      req.status === 'pending'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {req.status === 'pending' ? 'Pending Allocation' : 'En Route / Assigned'}
                  </span>
                  <span className="text-[11px] text-[#6B7785]">{req.time}</span>
                </div>

                <h3 className="text-sm font-bold text-[#1F2A37] flex items-center gap-2">
                  <span>{req.patientName}</span>
                  <span className="text-xs font-normal text-[#6B7785]">({req.patientPhone})</span>
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#6B7785]">
                  <MapPin className="w-3.5 h-3.5 text-[#0B6EFD] shrink-0" />
                  <span>Pickup: <strong className="text-[#1F2A37]">{req.pickupAddress}</strong></span>
                </div>

                <p className="text-xs text-[#DC3545] font-medium pt-1">
                  Condition: {req.condition}
                </p>

                {req.assignedAmbulance && (
                  <div className="text-xs text-emerald-700 font-semibold pt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dispatched: {req.assignedAmbulance}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0 w-full md:w-auto">
                {req.status === 'pending' ? (
                  <button
                    type="button"
                    onClick={() => handleAssign(req.id)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Assign Nearest Ambulance</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => alert('Vehicle telemetry is tracking on map (Day 4)!')}
                    className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200 text-[#0B6EFD] hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
                  >
                    <Ambulance className="w-4 h-4" />
                    <span>Live GPS Track</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
