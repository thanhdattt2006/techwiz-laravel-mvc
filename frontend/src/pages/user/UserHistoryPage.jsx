import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import {
  Clock,
  MapPin,
  Hospital,
  Ambulance,
  Search,
  Star,
  Activity,
  ArrowRight,
  FileText,
  Navigation,
  CheckCircle2,
  Calendar,
  UserCheck,
} from 'lucide-react';

const MOCK_HISTORY_RECORDS = [
  {
    id: 'SOS-2026-092',
    date: 'Sept 22, 2026 • 15:30',
    status: 'En Route',
    statusColor: 'bg-red-50 text-[#DC3545] border-red-200',
    pickupAddress: '500 N Michigan Ave, Apt 14B, Chicago, IL 60611',
    hospital: 'Northwestern Memorial Hospital',
    vehicleNumber: 'AMB-CHI-102',
    model: 'Ford Transit 250 Advanced Life Support',
    type: 'ICU',
    crew: 'Paramedic Team Alpha (Marcus Vance, Sarah Jenkins EMT-P)',
    condition: 'Severe acute chest pain and oxygen saturation dropped to 88%',
    cost: 20,
    reviewed: false,
    activeTracking: true,
    telemetry: {
      triageTime: '15:30:12',
      dispatchedTime: '15:31:05',
      arrivedTime: 'En Route (ETA ~5 min)',
      handoverTime: 'Pending Admission',
    },
  },
  {
    id: 'SOS-2026-081',
    date: 'Sept 18, 2026 • 14:22',
    status: 'Completed',
    statusColor: 'bg-emerald-50 text-[#198754] border-emerald-200',
    pickupAddress: '450 N Michigan Ave, Chicago Central, IL',
    hospital: 'Northwestern Memorial Hospital',
    vehicleNumber: 'AMB-CHI-101',
    model: 'Mercedes-Benz Sprinter 3500 Mobile ICU',
    type: 'ICCU',
    crew: 'Paramedic Team Alpha (Marcus Vance, Sarah Jenkins EMT-P)',
    condition: 'Transport from Michigan Ave to Northwestern Memorial Hospital. High flow O2 administered.',
    cost: 25,
    reviewed: true,
    rating: 5,
    activeTracking: false,
    telemetry: {
      triageTime: '14:22:04',
      dispatchedTime: '14:23:10',
      arrivedTime: '14:29:45',
      handoverTime: '14:52:10',
    },
  },
  {
    id: 'SOS-2026-064',
    date: 'Aug 04, 2026 • 09:15',
    status: 'Completed',
    statusColor: 'bg-emerald-50 text-[#198754] border-emerald-200',
    pickupAddress: '122 S Michigan Ave, Chicago Central',
    hospital: 'Rush University Medical Center',
    vehicleNumber: 'AMB-CHI-105',
    model: 'Freightliner M2 Heavy Duty ICCU Rescue',
    type: 'ICCU',
    crew: 'Paramedic Team Delta (Brian O\'Connor, Lisa Ray EMT-P)',
    condition: 'Severe allergic reaction with acute bronchospasm. Intramuscular Epinephrine administered.',
    cost: 30,
    reviewed: false,
    activeTracking: false,
    telemetry: {
      triageTime: '09:15:30',
      dispatchedTime: '09:16:45',
      arrivedTime: '09:22:15',
      handoverTime: '09:48:30',
    },
  },
  {
    id: 'SOS-2026-052',
    date: 'July 12, 2026 • 22:40',
    status: 'Cancelled',
    statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
    pickupAddress: '800 W Madison St, West Loop, Chicago',
    hospital: 'University of Chicago Medicine',
    vehicleNumber: 'AMB-CHI-103',
    model: 'Chevrolet Express 3500 A/C Transport',
    type: 'A/C',
    crew: 'Paramedic Team Bravo (David Kim, Elena Rostova EMT)',
    condition: 'False alarm / patient transported by family vehicle prior to vehicle arrival.',
    cost: 0,
    reviewed: false,
    activeTracking: false,
    telemetry: {
      triageTime: '22:40:11',
      dispatchedTime: '22:41:20',
      arrivedTime: 'Cancelled En Route',
      handoverTime: 'N/A',
    },
  },
];

export default function UserHistoryPage() {
  const { showAlert } = useModal();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return MOCK_HISTORY_RECORDS.filter((rec) => {
      const matchTab =
        activeTab === 'ALL' ||
        (activeTab === 'COMPLETED' && rec.status === 'Completed') ||
        (activeTab === 'ACTIVE' && rec.status === 'En Route') ||
        (activeTab === 'CANCELLED' && rec.status === 'Cancelled');

      const query = searchTerm.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        rec.id.toLowerCase().includes(query) ||
        rec.hospital.toLowerCase().includes(query) ||
        rec.pickupAddress.toLowerCase().includes(query) ||
        rec.vehicleNumber.toLowerCase().includes(query) ||
        rec.condition.toLowerCase().includes(query);

      return matchTab && matchSearch;
    });
  }, [activeTab, searchTerm]);

  const handlePrintSummary = (rec) => {
    showAlert({
      title: `Transport Summary • ${rec.id}`,
      message: `Certified Care Record: ${rec.model} routed to ${rec.hospital}. Pickup: ${rec.pickupAddress}. Paramedic Crew: ${rec.crew}. Status: ${rec.status}. Billing fee: $${rec.cost}.`,
      type: 'info',
      confirmText: 'Done',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
              Emergency Ledger
            </span>
            <span className="text-xs text-[#6B7785]">Total Lifetime Dispatches: 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F2A37]">
            Emergency Dispatch & Transport History
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7785] leading-relaxed">
            Historical registry of all emergency calls, verified paramedic teams, receiving medical centers, and care reviews associated with your account.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/feedback"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition shadow-xs"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Service Feedback Desk</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B6EFD] flex items-center justify-center font-bold">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#6B7785] block font-medium">Completed Transports</span>
            <div className="text-2xl font-black text-[#1F2A37]">2 Transports</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#6B7785] block font-medium">Average Response Time</span>
            <div className="text-2xl font-black text-emerald-700">6.4 Minutes</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC3545] flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#6B7785] block font-medium">Active SOS In Progress</span>
            <div className="text-2xl font-black text-[#DC3545]">1 Unit En Route</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Records (4)' },
              { id: 'ACTIVE', label: 'En Route (1)' },
              { id: 'COMPLETED', label: 'Completed (2)' },
              { id: 'CANCELLED', label: 'Cancelled (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0B6EFD] text-white shadow-xs'
                    : 'bg-[#F5F8FC] hover:bg-slate-100 text-[#1F2A37]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#6B7785] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, hospital, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
            />
          </div>
        </div>
      </div>

      {/* Incident Records Cards List */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs hover:shadow-md transition space-y-4"
            >
              {/* Record Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-[#1F2A37]">{rec.id}</span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${rec.statusColor}`}
                  >
                    {rec.status}
                  </span>
                  {rec.activeTracking && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#DC3545] animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      Live Radar Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6B7785]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{rec.date}</span>
                </div>
              </div>

              {/* Record Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Col 1: Route & Medical Center */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7785] block">
                    Transport Vector
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#DC3545] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-[#6B7785] block">Pickup Location:</span>
                        <span className="font-semibold text-[#1F2A37]">{rec.pickupAddress}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Hospital className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-[#6B7785] block">Receiving Emergency Facility:</span>
                        <span className="font-bold text-[#1F2A37]">{rec.hospital}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: Vehicle & Paramedic Team */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7785] block">
                    Dispatched Unit & Crew
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Ambulance className="w-4 h-4 text-[#0B6EFD] shrink-0" />
                      <span className="font-mono font-bold text-[#1F2A37]">
                        {rec.vehicleNumber} ({rec.type})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6B7785] line-clamp-1">{rec.model}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#1F2A37]">
                      <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="line-clamp-1">{rec.crew}</span>
                    </div>
                  </div>
                </div>

                {/* Col 3: Clinical Summary & Fees */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7785] block">
                    Clinical Notes & Rate
                  </span>
                  <p className="text-[11px] text-[#6B7785] line-clamp-2 leading-relaxed bg-[#F5F8FC] p-2 rounded-lg border border-[#E2E8F0]">
                    {rec.condition}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#6B7785]">Standard Billing:</span>
                    <span className="font-bold text-[#1F2A37]">
                      {rec.cost === 0 ? 'No Charge (Waived)' : `$${rec.cost}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Record Bottom Action Buttons */}
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {rec.reviewed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reviewed (5 Stars)</span>
                    </span>
                  ) : rec.status === 'Completed' ? (
                    <Link
                      to={`/feedback?requestId=${rec.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold border border-amber-200 transition"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Submit Service Feedback</span>
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => handlePrintSummary(rec)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#1F2A37] font-semibold transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#6B7785]" />
                    <span>Summary</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {rec.activeTracking && (
                    <Link
                      to={`/tracking/${rec.vehicleNumber}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC3545] hover:bg-red-700 text-white font-bold transition shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5 animate-pulse" />
                      <span>Live GPS Radar</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedRecord(rec)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0B6EFD] hover:bg-blue-100 font-bold transition cursor-pointer"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3">
            <Ambulance className="w-10 h-10 text-[#6B7785] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#1F2A37]">No Records Found</h3>
            <p className="text-xs text-[#6B7785]">
              No dispatch records matched your current search query or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Telemetry Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[11px] font-mono text-[#6B7785]">INCIDENT TELEMETRY</span>
                <h3 className="text-base font-bold text-[#1F2A37]">{selectedRecord.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-[#6B7785] font-bold"
              >
                ✕
              </button>
            </div>

            {/* Timeline Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B7785]">Triage Verification:</span>
                  <span className="font-mono font-bold text-[#1F2A37]">
                    {selectedRecord.telemetry.triageTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7785]">Ambulance Dispatched:</span>
                  <span className="font-mono font-bold text-[#1F2A37]">
                    {selectedRecord.telemetry.dispatchedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7785]">Scene Arrival Time:</span>
                  <span className="font-mono font-bold text-[#0B6EFD]">
                    {selectedRecord.telemetry.arrivedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7785]">Clinical Handover:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {selectedRecord.telemetry.handoverTime}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#1F2A37] block">Assigned Unit & Crew:</span>
                <p className="text-[#6B7785] bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {selectedRecord.model} ({selectedRecord.vehicleNumber}) • {selectedRecord.crew}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#1F2A37] block">Receiving Facility:</span>
                <p className="text-[#6B7785]">{selectedRecord.hospital}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2.5 rounded-xl bg-[#0B6EFD] text-white font-bold text-xs hover:bg-[#084298] transition cursor-pointer"
            >
              Close Telemetry Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
