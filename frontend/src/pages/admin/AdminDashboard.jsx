import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import {
  Ambulance,
  Activity,
  MessageSquare,
  Mail,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Clock,
} from 'lucide-react';

function AddAmbulanceModalContent({ onClose, onAdd }) {
  const [unitId, setUnitId] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('ICCU');
  const [region, setRegion] = useState('Chicago Downtown');
  const [rate, setRate] = useState('25');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!unitId.trim() || !model.trim()) {
      setError('Please fill in both Unit Identifier and Model description.');
      return;
    }
    onAdd({
      unitId: unitId.trim(),
      model: model.trim(),
      type,
      region,
      rate: rate.startsWith('$') ? rate : `$${rate}`,
      status: 'Ready',
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[#DC3545] text-xs font-semibold">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
          Vehicle Identifier <span className="text-[#DC3545]">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. AMB-CHI-107"
          value={unitId}
          onChange={(e) => {
            setUnitId(e.target.value);
            if (error) setError('');
          }}
          className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
          Model Name / Specification <span className="text-[#DC3545]">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Ford Transit Mobile ALS"
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            if (error) setError('');
          }}
          className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
            Type Category
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
          >
            <option value="ICCU">ICCU (Advanced Cardiac)</option>
            <option value="ICU">ICU (Intensive Care)</option>
            <option value="A/C">A/C Support</option>
            <option value="Non-A/C">Non-A/C Standard</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
            Operating Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
          >
            <option value="Chicago Downtown">Chicago Downtown</option>
            <option value="Chicago Central">Chicago Central</option>
            <option value="North Chicago">North Chicago</option>
            <option value="South Chicago">South Chicago</option>
            <option value="West Loop">West Loop</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
          Base Dispatch Rate ($)
        </label>
        <input
          type="number"
          min="1"
          placeholder="25"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#1F2A37] bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B6EFD] hover:bg-[#084298] transition cursor-pointer shadow-xs"
        >
          Save Unit
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showCustomModal, showAlert } = useModal();

  const [fleet, setFleet] = useState([
    {
      unitId: 'AMB-CHI-101',
      model: 'Mercedes Sprinter 3500 Mobile ICU',
      type: 'ICCU',
      region: 'Chicago Central',
      rate: '$25',
      status: 'Ready',
    },
    {
      unitId: 'AMB-CHI-102',
      model: 'Ford Transit 250 Life Support',
      type: 'ICU',
      region: 'Chicago Downtown',
      rate: '$20',
      status: 'Ready',
    },
    {
      unitId: 'AMB-CHI-103',
      model: 'Chevrolet Express 3500 Dual A/C',
      type: 'A/C',
      region: 'North Chicago',
      rate: '$15',
      status: 'Ready',
    },
  ]);

  const handleAddAmbulance = () => {
    showCustomModal({
      title: 'Register Ambulance Unit',
      content: ({ close }) => (
        <AddAmbulanceModalContent
          onClose={close}
          onAdd={(newUnit) => {
            setFleet((prev) => [newUnit, ...prev]);
            showAlert({
              title: 'Ambulance Registered',
              message: `Unit ${newUnit.unitId} successfully added to LifeLink fleet registry.`,
              type: 'success',
              confirmText: false,
              autoCloseMs: 2000,
            });
          }}
        />
      ),
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
            Role: System Administrator
          </span>
          <h1 className="text-2xl font-black text-[#1F2A37] mt-2">
            Welcome back, {user?.fullname || 'Admin'}
          </h1>
          <p className="text-xs text-[#6B7785] mt-1">
            LifeLink eAmbulance System Management Console • Chicago Metropolitan Sector
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddAmbulance}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Ambulance Unit</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Total Fleet Size</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">{fleet.length} Units</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Operational
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B6EFD] flex items-center justify-center">
            <Ambulance className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Emergency Requests</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">24 Calls</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> Avg 7.2m Arrival
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC3545] flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Patient Feedbacks</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">18 Reviews</div>
            <span className="text-[11px] text-purple-600 font-bold flex items-center gap-1 mt-1">
              ★ 4.96 Average Rating
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7785] font-semibold">Inbound Inquiries</span>
            <div className="text-2xl font-black text-[#1F2A37] mt-1">5 Unread</div>
            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> Contact Us Form
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Fleet Overview Table Preview */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#1F2A37]">Fleet Inventory Overview</h2>
            <p className="text-xs text-[#6B7785]">Preview of categorized emergency units available for dispatch</p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0B6EFD]">Live Fleet Status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8FC] text-[#6B7785] uppercase tracking-wider font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Unit #</th>
                <th className="py-3 px-4">Model Description</th>
                <th className="py-3 px-4">Type Class</th>
                <th className="py-3 px-4">Operating Region</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#1F2A37]">
              {fleet.map((item) => (
                <tr key={item.unitId} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#0B6EFD]">{item.unitId}</td>
                  <td className="py-3 px-4 font-semibold">{item.model}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.type === 'ICCU'
                          ? 'bg-purple-100 text-purple-800'
                          : item.type === 'ICU'
                          ? 'bg-blue-100 text-blue-800'
                          : item.type === 'A/C'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#6B7785]">{item.region}</td>
                  <td className="py-3 px-4 font-bold text-[#0B6EFD]">{item.rate}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      {item.status || 'Ready'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
