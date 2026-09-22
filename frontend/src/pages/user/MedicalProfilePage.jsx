import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import {
  ShieldCheck,
  AlertTriangle,
  Pill,
  Droplet,
  Activity,
  Plus,
  Trash2,
  Save,
  Sparkles,
  CheckCircle2,
  FileText,
  UserCheck,
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const COMMON_CONDITIONS = [
  'Cardiovascular / Hypertension',
  'Respiratory / Asthma (COPD)',
  'Type 1 Diabetes',
  'Type 2 Diabetes',
  'Epilepsy / Seizure Disorder',
  'Cardiac Pacemaker Implanted',
  'Chronic Kidney Disease',
  'History of Stroke (CVA)',
];

const COMMON_ALLERGIES = [
  'Penicillin & Beta-lactams',
  'Aspirin & NSAIDs',
  'Sulfa Drugs (Sulfonamides)',
  'Medical Latex',
  'Iodine / Radiocontrast Media',
  'Peanuts & Tree Nuts',
  'Shellfish',
  'Morphine / Opiates',
];

const STORAGE_KEY = 'lifelink_patient_medical_profile';

export default function MedicalProfilePage() {
  const { user } = useAuth();
  const { showAlert } = useModal();

  // Load profile from localStorage or initialize with sensible defaults
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      bloodGroup: 'O+',
      organDonor: true,
      dob: '1990-08-15',
      gender: 'Female',
      height: '168 cm',
      weight: '62 kg',
      primaryLanguage: 'English',
      conditions: ['Cardiovascular / Hypertension', 'Respiratory / Asthma (COPD)'],
      allergies: ['Penicillin & Beta-lactams'],
      medications: [
        'Lisinopril 10mg (Once daily morning)',
        'Albuterol HFA Inhaler 90mcg (PRN 2 puffs for acute wheezing)',
      ],
      icePrimary: {
        name: 'Dr. Arthur Vance',
        relation: 'Spouse',
        phone: '0918-999-888',
        altPhone: '028-3333-4444',
      },
      iceSecondary: {
        name: 'Helen Vance',
        relation: 'Parent',
        phone: '0903-111-222',
        altPhone: '',
      },
      autoTransmitSos: true,
      specialInstructions:
        'Patient carries emergency rescue inhaler in handbag. Severe adverse rash to Penicillin.',
    };
  });

  const [newMedication, setNewMedication] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // storage unavailable
    }
  }, [profile]);

  const handleBloodGroupSelect = (bg) => {
    setProfile((prev) => ({ ...prev, bloodGroup: bg }));
  };

  const toggleCondition = (cond) => {
    setProfile((prev) => {
      const exists = prev.conditions.includes(cond);
      return {
        ...prev,
        conditions: exists
          ? prev.conditions.filter((c) => c !== cond)
          : [...prev.conditions, cond],
      };
    });
  };

  const handleAddCustomCondition = (e) => {
    e.preventDefault();
    if (!customCondition.trim()) return;
    if (!profile.conditions.includes(customCondition.trim())) {
      setProfile((prev) => ({
        ...prev,
        conditions: [...prev.conditions, customCondition.trim()],
      }));
    }
    setCustomCondition('');
  };

  const toggleAllergy = (allergy) => {
    setProfile((prev) => {
      const exists = prev.allergies.includes(allergy);
      return {
        ...prev,
        allergies: exists
          ? prev.allergies.filter((a) => a !== allergy)
          : [...prev.allergies, allergy],
      };
    });
  };

  const handleAddCustomAllergy = (e) => {
    e.preventDefault();
    if (!customAllergy.trim()) return;
    if (!profile.allergies.includes(customAllergy.trim())) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()],
      }));
    }
    setCustomAllergy('');
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMedication.trim()) return;
    setProfile((prev) => ({
      ...prev,
      medications: [...prev.medications, newMedication.trim()],
    }));
    setNewMedication('');
  };

  const handleRemoveMedication = (index) => {
    setProfile((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleDemoFill = () => {
    setProfile({
      bloodGroup: 'O+',
      organDonor: true,
      dob: '1988-04-22',
      gender: 'Female',
      height: '165 cm',
      weight: '58 kg',
      primaryLanguage: 'English',
      conditions: [
        'Cardiovascular / Hypertension',
        'Respiratory / Asthma (COPD)',
        'Cardiac Pacemaker Implanted',
      ],
      allergies: ['Penicillin & Beta-lactams', 'Aspirin & NSAIDs'],
      medications: [
        'Lisinopril 20mg (Morning)',
        'Metoprolol Tartrate 25mg (Twice daily)',
        'Ventolin Inhaler 100mcg (PRN as needed)',
      ],
      icePrimary: {
        name: 'Dr. Arthur Vance',
        relation: 'Spouse',
        phone: '0918-999-888',
        altPhone: '028-3333-4444',
      },
      iceSecondary: {
        name: 'Helen Vance',
        relation: 'Parent',
        phone: '0903-111-222',
        altPhone: '',
      },
      autoTransmitSos: true,
      specialInstructions:
        'Patient has titanium pacemaker implanted in upper left chest. Penicillin induces acute anaphylaxis.',
    });

    showAlert({
      title: 'Demo Medical Dossier Applied',
      message:
        'Pre-populated verified clinical indicators (Blood O+, Penicillin Anaphylaxis, Pacemaker & Lisinopril).',
      type: 'success',
      confirmText: false,
      autoCloseMs: 2000,
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      showAlert({
        title: 'Emergency Medical Profile Saved!',
        message:
          'Your medical dossier has been updated. Critical blood type, allergies, and ICE contacts are linked to your 1-Touch SOS beacon.',
        type: 'success',
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
              Emergency Clinical Dossier
            </span>
            <span className="text-xs text-[#6B7785]">User: {user?.fullname || 'Patient'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F2A37]">
            Emergency Medical Profile & ICE Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7785] leading-relaxed">
            Essential clinical data transmitted to Chicago emergency dispatchers and attending paramedics immediately upon activating your 1-Touch SOS protocol.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDemoFill}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>1-Click Demo Fill</span>
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Dossier</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Medical dossier successfully synchronized and saved to your device.</span>
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Clinical Records */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Blood Group & Vital Identifiers */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                <Droplet className="w-5 h-5 text-[#DC3545]" />
                <span>Blood Classification & Vital Identifiers</span>
              </h2>
              <span className="text-[11px] font-semibold text-[#DC3545] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Critical for Transfusion
              </span>
            </div>

            {/* Blood Type Grid Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
                Select Blood Group <span className="text-[#DC3545]">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = profile.bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => handleBloodGroupSelect(bg)}
                      className={`py-3 rounded-xl border text-sm font-black transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-[#DC3545] text-white border-[#DC3545] shadow-md shadow-red-500/20 scale-105'
                          : 'bg-[#F5F8FC] hover:bg-slate-100 text-[#1F2A37] border-[#E2E8F0]'
                      }`}
                    >
                      <Droplet className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : 'text-red-400'}`} />
                      <span>{bg}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Physical Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">Biological Sex</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other / Non-disclosed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">Height & Weight</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="168 cm"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                  />
                  <input
                    type="text"
                    placeholder="62 kg"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                  />
                </div>
              </div>
            </div>

            {/* Organ Donor Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#1F2A37] block">Registered Organ Donor</span>
                <span className="text-[#6B7785] text-[11px]">
                  Authorize anatomical donation in critical trauma scenarios
                </span>
              </div>
              <button
                type="button"
                onClick={() => setProfile((prev) => ({ ...prev, organDonor: !prev.organDonor }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.organDonor ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    profile.organDonor ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 2: Chronic Medical Conditions */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#0B6EFD]" />
                <span>Pre-existing Diagnoses & Chronic Conditions</span>
              </h2>
              <span className="text-xs text-[#6B7785]">Select all active conditions</span>
            </div>

            <p className="text-xs text-[#6B7785]">
              Attending paramedics inspect underlying conditions to avoid contraindicated drugs and calibrate oxygenation or cardiac pacing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {COMMON_CONDITIONS.map((cond) => {
                const checked = profile.conditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`p-3 rounded-xl border text-xs text-left font-medium transition cursor-pointer flex items-center justify-between ${
                      checked
                        ? 'bg-blue-50/80 border-[#0B6EFD] text-[#0B6EFD] font-bold shadow-xs'
                        : 'bg-[#F5F8FC] border-[#E2E8F0] text-[#1F2A37] hover:bg-slate-100'
                    }`}
                  >
                    <span>{cond}</span>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        checked
                          ? 'bg-[#0B6EFD] border-[#0B6EFD] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Condition Adder */}
            <form onSubmit={handleAddCustomCondition} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add other medical condition (e.g. Sickle Cell, Sleep Apnea)..."
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1F2A37] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Section 3: Severe Drug Allergies */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#DC3545]" />
                <span>Critical Drug Adverse Reactions & Allergies</span>
              </h2>
              <span className="text-[11px] font-bold text-[#DC3545] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Anaphylaxis Warnings
              </span>
            </div>

            <p className="text-xs text-[#6B7785]">
              Alerts ambulance crews against administering substances that trigger fatal histamine release or airway obstruction.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {COMMON_ALLERGIES.map((allergy) => {
                const checked = profile.allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`p-3 rounded-xl border text-xs text-left font-medium transition cursor-pointer flex items-center justify-between ${
                      checked
                        ? 'bg-red-50 border-red-300 text-[#DC3545] font-bold shadow-xs'
                        : 'bg-[#F5F8FC] border-[#E2E8F0] text-[#1F2A37] hover:bg-slate-100'
                    }`}
                  >
                    <span>{allergy}</span>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        checked ? 'bg-[#DC3545] border-[#DC3545] text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Allergy Adder */}
            <form onSubmit={handleAddCustomAllergy} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add other allergen (e.g. Codeine, Nickel, Contrast dye)..."
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1F2A37] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Section 4: Daily Medications */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" />
                <span>Active Daily & Maintenance Medications</span>
              </h2>
              <span className="text-xs text-[#6B7785]">{profile.medications.length} items registered</span>
            </div>

            <div className="space-y-2">
              {profile.medications.map((med, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="font-semibold text-[#1F2A37]">{med}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(index)}
                    className="p-1 text-[#6B7785] hover:text-[#DC3545] rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Medication Form */}
            <form onSubmit={handleAddMedication} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. Metformin 500mg (Twice daily with meals)..."
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Drug</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): ICE Contacts & SOS Protocol Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section 5: In Case of Emergency (ICE) Contacts */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>Emergency Contacts (ICE)</span>
              </h2>
            </div>

            <p className="text-xs text-[#6B7785]">
              These contacts are instantly notified and briefed by Chicago dispatchers upon hospital admission.
            </p>

            {/* Primary ICE */}
            <div className="p-4 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1F2A37] uppercase tracking-wider text-[11px]">
                  Primary ICE Contact
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Primary
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-[#6B7785] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.icePrimary.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      icePrimary: { ...profile.icePrimary, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1F2A37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-[#6B7785] mb-1">Relationship</label>
                  <select
                    value={profile.icePrimary.relation}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        icePrimary: { ...profile.icePrimary, relation: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1F2A37]"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Physician">Physician</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#6B7785] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.icePrimary.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        icePrimary: { ...profile.icePrimary, phone: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1F2A37] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Secondary ICE */}
            <div className="p-4 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-3 text-xs">
              <span className="font-bold text-[#1F2A37] uppercase tracking-wider text-[11px] block">
                Secondary ICE Contact
              </span>

              <div>
                <label className="block text-[11px] text-[#6B7785] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.iceSecondary.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      iceSecondary: { ...profile.iceSecondary, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1F2A37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-[#6B7785] mb-1">Relationship</label>
                  <select
                    value={profile.iceSecondary.relation}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        iceSecondary: { ...profile.iceSecondary, relation: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1F2A37]"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#6B7785] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.iceSecondary.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        iceSecondary: { ...profile.iceSecondary, phone: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1F2A37] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Automatic SOS Transmission Policy */}
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#0B6EFD] font-bold text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>SOS Telemetry Link Protocol</span>
            </div>

            <p className="text-[#6B7785] leading-relaxed">
              When enabled, triggering the 1-Touch Emergency SOS beacon on your dashboard automatically transmits your Blood Type ({profile.bloodGroup}), active allergies ({profile.allergies.length}), and ICE contacts to the assigned ambulance en route.
            </p>

            <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
              <span className="font-bold text-[#1F2A37]">Auto-transmit Dossier with SOS</span>
              <button
                type="button"
                onClick={() =>
                  setProfile((prev) => ({ ...prev, autoTransmitSos: !prev.autoTransmitSos }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.autoTransmitSos ? 'bg-[#0B6EFD]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    profile.autoTransmitSos ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 7: Clinical Dossier Live Preview Box */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#1F2A37]">
              <FileText className="w-4 h-4 text-[#0B6EFD]" />
              <span>Paramedic Handover Summary</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-700">
              <div>
                <strong>BLOOD:</strong> <span className="text-[#DC3545] font-black">{profile.bloodGroup}</span>{' '}
                {profile.organDonor && '(Organ Donor)'}
              </div>
              <div>
                <strong>ALLERGIES:</strong>{' '}
                <span className="text-red-600 font-bold">
                  {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None Reported'}
                </span>
              </div>
              <div>
                <strong>CONDITIONS:</strong>{' '}
                <span>{profile.conditions.length > 0 ? profile.conditions.join(', ') : 'None'}</span>
              </div>
              <div>
                <strong>ICE:</strong> {profile.icePrimary.name} ({profile.icePrimary.phone})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
