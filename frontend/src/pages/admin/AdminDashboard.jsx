import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import marketsData from '../../data/markets.json';
import {
  Store,
  Users,
  Mail,
  TrendingUp,
  PlusCircle,
  Clock,
  MapPin,
  Star,
  Check,
  ShieldCheck,
} from 'lucide-react';

const INITIAL_VENDOR_APPLICATIONS = [
  {
    id: 'VND-2026-081',
    farmName: 'Midwest Berry & Orchard Collective',
    farmerName: 'Thomas Becker',
    phone: '(815) 555-4421',
    distanceMiles: 38,
    marketRequested: 'Lincoln Park Farmers Market',
    specialty: 'Tree-ripened peaches, Honeycrisp apples, cider',
    certifications: ['USDA Organic Certified', 'Good Agricultural Practices (GAP)'],
    status: 'PENDING',
    appliedDate: 'Oct 20, 2026',
  },
  {
    id: 'VND-2026-082',
    farmName: 'Fox River Artisan Dairy & Creamery',
    farmerName: 'Amanda Ross',
    phone: '(630) 555-8812',
    distanceMiles: 42,
    marketRequested: 'Logan Square Farmers Market',
    specialty: 'Pasture-raised raw goat cheese, cultured farm butter',
    certifications: ['IDPH Grade A Dairy Permit', 'Non-GMO Feed Verified'],
    status: 'PENDING',
    appliedDate: 'Oct 21, 2026',
  },
  {
    id: 'VND-2026-079',
    farmName: 'Prairie Organic Grove',
    farmerName: 'Sarah Jenkins',
    phone: '(312) 555-7821',
    distanceMiles: 24,
    marketRequested: 'Green City Market (Stall #04)',
    specialty: 'Heirloom tomatoes, wildflower raw honey, herbs',
    certifications: ['100% USDA Organic Certified', 'Illinois Sustainable Agriculture'],
    status: 'APPROVED',
    appliedDate: 'Oct 15, 2026',
  },
  {
    id: 'VND-2026-070',
    farmName: 'Great Plains Industrial Produce Co.',
    farmerName: 'Anonymous Corporate Rep',
    phone: '(402) 555-0919',
    distanceMiles: 480,
    marketRequested: 'Daley Plaza Farmers Market',
    specialty: 'Commercial bulk potatoes',
    certifications: ['Conventional Mass Production'],
    status: 'REJECTED',
    appliedDate: 'Oct 10, 2026',
  },
];

const INITIAL_REVIEWS = [
  {
    id: 'REV-101',
    author: 'Elena R. (Lincoln Park)',
    market: 'Green City Market',
    farmer: 'Prairie Organic Grove',
    rating: 5,
    highlight: 'Outstanding Freshness & Flavor',
    comment: 'The heirloom tomatoes had the most incredible aroma and sweetness. Picked up right on time at Stall #04!',
    status: 'FEATURED',
    date: 'Oct 22, 2026',
  },
  {
    id: 'REV-102',
    author: 'David M. (Logan Square)',
    market: 'Logan Square Farmers Market',
    farmer: 'Heritage Artisan Bakehouse',
    rating: 5,
    highlight: 'Warmth & Packaging',
    comment: 'Sourdough was still slightly warm from the wood-fired hearth. Easy cash settlement without any hassle.',
    status: 'PUBLISHED',
    date: 'Oct 21, 2026',
  },
  {
    id: 'REV-103',
    author: 'Michael T. (West Loop)',
    market: 'Wicker Park Farmers Market',
    farmer: 'Rolling Hills Dairy',
    rating: 4,
    highlight: 'Punctuality',
    comment: 'Eggs were clean and fresh. Slight delay finding the exact stall number, but great overall quality.',
    status: 'PUBLISHED',
    date: 'Oct 19, 2026',
  },
  {
    id: 'REV-104',
    author: 'Spam Bot 99',
    market: 'Unknown',
    farmer: 'N/A',
    rating: 1,
    highlight: 'Spam Link',
    comment: 'Visit discountcrypto.com for fast loans and free tokens online!!!',
    status: 'HIDDEN',
    date: 'Oct 18, 2026',
  },
];

const INITIAL_INQUIRIES = [
  {
    id: 'MSG-401',
    sender: 'Claire Kensington',
    email: 'claire.k@gmail.com',
    category: 'Stall Availability',
    subject: 'Waitlist for spring seedling vendors at Lincoln Park?',
    message: 'Hello, our family nursery in McHenry County specializes in heirloom vegetable starts. When do Spring 2027 stall applications open?',
    status: 'NEW',
    date: 'Oct 23, 2026',
  },
  {
    id: 'MSG-402',
    sender: 'Carlos Gutierrez',
    email: 'carlos.g@pilsenarts.org',
    category: 'Community Partnership',
    subject: 'Proposal for bilingual nutrition workshops at Pilsen Community Market',
    message: 'We would love to coordinate with MarketLink to distribute free SNAP/LINK matching coupon booklets for fresh vegetables.',
    status: 'RESOLVED',
    date: 'Oct 21, 2026',
  },
  {
    id: 'MSG-403',
    sender: 'Oak Park Elementary (PTA)',
    email: 'pta@oakpark88.edu',
    category: 'Educational Tour',
    subject: 'Farmer meet-and-greet field trip inquiry',
    message: 'Can 4th graders visit Green City Market on a Wednesday morning to meet apple orchardists and learn about zero food miles?',
    status: 'NEW',
    date: 'Oct 20, 2026',
  },
];

function AddMarketModalContent({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [operatingDays, setOperatingDays] = useState('Saturdays');
  const [operatingHours, setOperatingHours] = useState('07:00 AM - 01:00 PM');
  const [stallsCount, setStallsCount] = useState('32');
  const [specialty, setSpecialty] = useState('Organic berries & heirloom veggies');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !neighborhood.trim()) {
      setError('Please fill in Market Name, Neighborhood, and Street Address.');
      return;
    }

    onAdd({
      id: `mkt-0${Date.now().toString().slice(-1)}`,
      name: name.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      latitude: 41.881832,
      longitude: -87.623177,
      operatingDays,
      operatingHours,
      stallsCount: parseInt(stallsCount, 10) || 25,
      specialty: specialty.trim(),
      status: 'ACTIVE',
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
          {error}
        </div>
      )}

      <div>
        <label className="block font-bold text-[#0F172A] mb-1">Market Name *</label>
        <input
          type="text"
          placeholder="e.g. Evanston Community Farmers Market"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#0F172A] mb-1">Neighborhood *</label>
          <input
            type="text"
            placeholder="e.g. North Shore / Evanston"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          />
        </div>
        <div>
          <label className="block font-bold text-[#0F172A] mb-1">Stall Capacity</label>
          <input
            type="number"
            value={stallsCount}
            onChange={(e) => setStallsCount(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#0F172A] mb-1">Street Address *</label>
        <input
          type="text"
          placeholder="e.g. 1800 Maple Ave, Evanston, IL"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#0F172A] mb-1">Operating Days</label>
          <select
            value={operatingDays}
            onChange={(e) => setOperatingDays(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          >
            <option value="Saturdays">Saturdays</option>
            <option value="Sundays">Sundays</option>
            <option value="Thursdays">Thursdays</option>
            <option value="Wednesdays & Saturdays">Wednesdays & Saturdays</option>
          </select>
        </div>
        <div>
          <label className="block font-bold text-[#0F172A] mb-1">Operating Hours</label>
          <input
            type="text"
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#0F172A] mb-1">Specialty Produce Focus</label>
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="e.g. Organic heirloom crops, farmstead dairy, honey"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8DF]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          Register Farmers Market
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const { showAlert, showCustomModal } = useModal();

  const [activeTab, setActiveTab] = useState('MARKETS'); // 'MARKETS' | 'VENDORS' | 'REVIEWS' | 'MESSAGES'
  const [marketsList, setMarketsList] = useState(marketsData);
  const [vendorApps, setVendorApps] = useState(INITIAL_VENDOR_APPLICATIONS);
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);

  // Add Market Modal
  const handleOpenAddMarketModal = () => {
    showCustomModal({
      title: 'Register New Farmers Market',
      render: (onClose) => (
        <AddMarketModalContent
          onClose={onClose}
          onAdd={(newMarket) => {
            setMarketsList((prev) => [newMarket, ...prev]);
            showAlert({
              title: 'Market Registered',
              message: `${newMarket.name} has been added to the Chicago public directory!`,
              type: 'success',
              confirmText: false,
              autoCloseMs: 2000,
            });
          }}
        />
      ),
    });
  };

  // Vendor Application Decision
  const handleVendorDecision = (appId, decision) => {
    setVendorApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: decision } : app))
    );
    showAlert({
      title: `Vendor ${decision === 'APPROVED' ? 'Approved' : 'Updated'}`,
      message: `Application ${appId} marked as ${decision}. Farmer has been notified.`,
      type: decision === 'APPROVED' ? 'success' : 'info',
      confirmText: false,
      autoCloseMs: 1800,
    });
  };

  // Review Moderation Action
  const handleReviewAction = (reviewId, newStatus) => {
    setReviewsList((prev) =>
      prev.map((rev) => (rev.id === reviewId ? { ...rev, status: newStatus } : rev))
    );
    showAlert({
      title: 'Review Moderated',
      message: `Review ${reviewId} status changed to ${newStatus}.`,
      type: 'info',
      confirmText: false,
      autoCloseMs: 1600,
    });
  };

  // Inquiries Resolution
  const handleToggleInquiryStatus = (msgId) => {
    setInquiries((prev) =>
      prev.map((msg) =>
        msg.id === msgId
          ? { ...msg, status: msg.status === 'NEW' ? 'RESOLVED' : 'NEW' }
          : msg
      )
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Top Header Banner */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Chicago Metropolitan Area • Central Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            MarketLink Governance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Oversee local farmers markets, audit family farm stall credentials, moderate community harvest reviews, and address shopper inquiries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF]">
          <button
            type="button"
            onClick={() => setActiveTab('MARKETS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'MARKETS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Markets ({marketsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('VENDORS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'VENDORS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Stall Apps ({vendorApps.filter((v) => v.status === 'PENDING').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REVIEWS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REVIEWS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({reviewsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MESSAGES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'MESSAGES'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inquiries ({inquiries.filter((m) => m.status === 'NEW').length})</span>
          </button>
        </div>
      </div>

      {/* 2. Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Active Markets</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{marketsList.length}</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">Citywide</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Chicago Neighborhood Hubs</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Stall Vendors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">182</span>
            <span className="text-xs text-blue-600 font-bold ml-2">Permitted</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Family Farms & Artisans</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Pre-Orders (Mo)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">1,420</span>
            <span className="text-xs text-amber-600 font-bold ml-2">Pickups</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Zero online gateway friction</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Satisfaction</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">4.9</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">/ 5.0 ★</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Based on 540 verified reviews</p>
        </div>
      </div>

      {/* 3. TAB 1: MARKETS REGISTRY */}
      {activeTab === 'MARKETS' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Chicago Farmers Markets Registry</h2>
              <p className="text-xs text-[#475569]">
                Directory of active market grounds, weekly operating schedules, and allocated vendor stall capacities.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddMarketModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Farmers Market</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketsList.map((mkt) => (
              <div
                key={mkt.id}
                className="border border-[#E2E8DF] rounded-2xl p-4 bg-[#F8FAF6] space-y-3 hover:border-emerald-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {mkt.neighborhood}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A] mt-1">{mkt.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#475569] bg-white px-2 py-0.5 rounded-md border border-[#E2E8DF]">
                    {mkt.stallsCount} Stalls
                  </span>
                </div>

                <div className="text-xs text-[#475569] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                    <span className="truncate">{mkt.address}, {mkt.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                    <span>{mkt.operatingDays} • {mkt.operatingHours}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E8DF] text-[11px] text-[#475569]">
                  Specialty: <span className="font-semibold text-[#0F172A]">{mkt.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: VENDOR APPLICATIONS */}
      {activeTab === 'VENDORS' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#E2E8DF]">
            <h2 className="text-base font-bold text-[#0F172A]">Farmer Stall Applications & Audits</h2>
            <p className="text-xs text-[#475569]">
              Review farm distance limits (&lt;50 miles standard), inspect USDA Organic / GAP certifications, and authorize market stall permits.
            </p>
          </div>

          <div className="space-y-4">
            {vendorApps.map((app) => (
              <div
                key={app.id}
                className="border border-[#E2E8DF] rounded-2xl p-5 bg-[#F8FAF6] space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8DF]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F172A]">{app.farmName}</span>
                      <span className="text-xs font-mono text-[#475569]">({app.id})</span>
                      {app.status === 'APPROVED' && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#16A34A]">
                          Approved
                        </span>
                      )}
                      {app.status === 'PENDING' && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Audit Pending
                        </span>
                      )}
                      {app.status === 'REJECTED' && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Grower: <strong>{app.farmerName}</strong> • Phone: <span className="font-mono">{app.phone}</span> • Applied: {app.appliedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white border border-[#E2E8DF]">
                      {app.distanceMiles} miles from Chicago
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Requested Market & Specialty Produce
                    </span>
                    <p className="font-semibold text-[#0F172A]">{app.marketRequested}</p>
                    <p className="text-[#475569] mt-0.5">{app.specialty}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Submitted Quality Certifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.certifications.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8DF] font-medium text-[11px] text-emerald-800"
                        >
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {app.status === 'PENDING' && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8DF]">
                    <button
                      type="button"
                      onClick={() => handleVendorDecision(app.id, 'REJECTED')}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVendorDecision(app.id, 'APPROVED')}
                      className="px-4 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Assign Stall</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: REVIEW MODERATION */}
      {activeTab === 'REVIEWS' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#E2E8DF]">
            <h2 className="text-base font-bold text-[#0F172A]">Community Harvest Reviews Moderation</h2>
            <p className="text-xs text-[#475569]">
              Curate shopper ratings, highlight outstanding family farm produce on the public homepage, and filter inappropriate submissions.
            </p>
          </div>

          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="border border-[#E2E8DF] rounded-2xl p-5 bg-[#F8FAF6] space-y-3 hover:border-emerald-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8DF]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0F172A]">{rev.author}</span>
                    <span className="text-[11px] text-[#475569]">reviewed</span>
                    <span className="font-bold text-xs text-[#16A34A]">{rev.farmer}</span>
                    <span className="text-[11px] text-[#475569]">at {rev.market}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                      {'★'.repeat(rev.rating)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.status === 'FEATURED'
                          ? 'bg-amber-100 text-amber-800'
                          : rev.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-[#16A34A]'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#0F172A] italic">"{rev.comment}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF] text-xs">
                  <span className="text-[11px] text-[#475569]">Highlight: {rev.highlight} • {rev.date}</span>
                  <div className="flex items-center gap-2">
                    {rev.status !== 'FEATURED' && rev.status !== 'HIDDEN' && (
                      <button
                        type="button"
                        onClick={() => handleReviewAction(rev.id, 'FEATURED')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-[11px] transition cursor-pointer"
                      >
                        Feature on Home
                      </button>
                    )}
                    {rev.status !== 'HIDDEN' ? (
                      <button
                        type="button"
                        onClick={() => handleReviewAction(rev.id, 'HIDDEN')}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition cursor-pointer"
                      >
                        Hide Review
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReviewAction(rev.id, 'PUBLISHED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#16A34A] hover:bg-emerald-100 font-bold text-[11px] transition cursor-pointer"
                      >
                        Restore Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: CONTACT INQUIRIES */}
      {activeTab === 'MESSAGES' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#E2E8DF]">
            <h2 className="text-base font-bold text-[#0F172A]">Public Inquiries & Market Helpline Inbox</h2>
            <p className="text-xs text-[#475569]">
              Inquiries submitted through the public contact form at Chicago Green Loop HQ.
            </p>
          </div>

          <div className="space-y-4">
            {inquiries.map((msg) => (
              <div
                key={msg.id}
                className="border border-[#E2E8DF] rounded-2xl p-5 bg-[#F8FAF6] space-y-3 hover:border-emerald-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8DF]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#0F172A]">{msg.sender}</span>
                      <span className="text-[11px] font-mono text-[#475569]">({msg.email})</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#E2E8DF]">
                        {msg.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A] mt-1">{msg.subject}</h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      msg.status === 'NEW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-[#475569]'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>

                <p className="text-xs text-[#475569]">{msg.message}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF] text-xs">
                  <span className="text-[11px] text-[#475569]">Received on {msg.date}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleInquiryStatus(msg.id)}
                    className="px-3 py-1 rounded-lg border border-[#E2E8DF] bg-white hover:bg-slate-100 text-xs font-bold text-[#0F172A] transition cursor-pointer"
                  >
                    {msg.status === 'NEW' ? 'Mark as Resolved' : 'Reopen Ticket'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
