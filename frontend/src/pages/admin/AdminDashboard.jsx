import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  BarChart3,
  Edit2,
  Trash2,
  Search,
  Download,
  UserCheck,
  UserX,
} from 'lucide-react';

const VALID_TABS = ['markets', 'vendors', 'users', 'reviews', 'messages', 'reports'];

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

const INITIAL_USERS = [
  {
    id: 'USR-001',
    fullname: 'Elena Rostova',
    email: 'elena.shopper@gmail.com',
    role: 'CUSTOMER',
    phone: '(312) 555-0143',
    neighborhood: 'Lincoln Park, Chicago',
    joinedDate: 'Sep 12, 2026',
    ordersPlaced: 14,
    status: 'ACTIVE',
  },
  {
    id: 'USR-002',
    fullname: 'Arthur Pendelton',
    email: 'farmer.art@gmail.com',
    role: 'FARMER',
    phone: '(312) 555-7821',
    neighborhood: 'McHenry County • Stall #04',
    joinedDate: 'Aug 20, 2026',
    ordersPlaced: 320,
    status: 'ACTIVE',
  },
  {
    id: 'USR-003',
    fullname: 'David Miller',
    email: 'david.m@yahoo.com',
    role: 'CUSTOMER',
    phone: '(773) 555-8910',
    neighborhood: 'Logan Square, Chicago',
    joinedDate: 'Oct 02, 2026',
    ordersPlaced: 6,
    status: 'ACTIVE',
  },
  {
    id: 'USR-004',
    fullname: 'Spam Bot / Bad Actor',
    email: 'freecrypto@botnetwork.ru',
    role: 'CUSTOMER',
    phone: '(000) 000-0000',
    neighborhood: 'Flagged Proxy IP',
    joinedDate: 'Oct 18, 2026',
    ordersPlaced: 0,
    status: 'SUSPENDED',
  },
  {
    id: 'USR-005',
    fullname: 'Amanda Ross',
    email: 'amanda@foxriverdairy.com',
    role: 'FARMER',
    phone: '(630) 555-8812',
    neighborhood: 'Fox River Valley • Stall #12',
    joinedDate: 'Oct 19, 2026',
    ordersPlaced: 85,
    status: 'ACTIVE',
  },
  {
    id: 'USR-006',
    fullname: 'Platform Governance Admin',
    email: 'admin.marketlink@gmail.com',
    role: 'ADMIN',
    phone: '(312) 555-FARM',
    neighborhood: 'Chicago Loop HQ',
    joinedDate: 'Aug 01, 2026',
    ordersPlaced: 0,
    status: 'ACTIVE',
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

const MARKET_PERFORMANCE_REPORTS = [
  { market: 'Green City Market', preOrders: 480, grossEstimate: '$14,200', activeStalls: 42, fulfillmentRate: '99.2%' },
  { market: 'Logan Square Farmers Market', preOrders: 360, grossEstimate: '$10,150', activeStalls: 35, fulfillmentRate: '98.5%' },
  { market: 'Lincoln Park Farmers Market', preOrders: 280, grossEstimate: '$7,840', activeStalls: 28, fulfillmentRate: '97.9%' },
  { market: 'Daley Plaza Farmers Market', preOrders: 190, grossEstimate: '$4,620', activeStalls: 22, fulfillmentRate: '98.1%' },
  { market: 'Wicker Park Farmers Market', preOrders: 110, grossEstimate: '$1,840', activeStalls: 18, fulfillmentRate: '96.8%' },
];

const TOP_PERFORMING_FARMS = [
  { farm: 'Prairie Organic Grove', grower: 'Arthur Pendelton', preOrdersFulfilled: 320, grossValue: '$8,940', rating: 4.95, badge: 'Gold Harvest Stall' },
  { farm: 'Fox River Artisan Dairy', grower: 'Amanda Ross', preOrdersFulfilled: 215, grossValue: '$6,420', rating: 4.92, badge: 'Artisan Creamery' },
  { farm: 'Midwest Berry Collective', grower: 'Thomas Becker', preOrdersFulfilled: 180, grossValue: '$4,860', rating: 4.88, badge: 'Top Seasonal Orchard' },
  { farm: 'Heritage Artisan Bakehouse', grower: 'Julian Vance', preOrdersFulfilled: 165, grossValue: '$3,720', rating: 4.90, badge: 'Zero Waste Bakehouse' },
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
      id: `mkt-0${Date.now().toString().slice(-4)}`,
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

function EditMarketModalContent({ market, onClose, onSave }) {
  const [name, setName] = useState(market.name);
  const [neighborhood, setNeighborhood] = useState(market.neighborhood);
  const [address, setAddress] = useState(market.address);
  const [operatingDays, setOperatingDays] = useState(market.operatingDays);
  const [operatingHours, setOperatingHours] = useState(market.operatingHours);
  const [stallsCount, setStallsCount] = useState(market.stallsCount.toString());
  const [specialty, setSpecialty] = useState(market.specialty);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !neighborhood.trim()) {
      setError('Please fill in Market Name, Neighborhood, and Street Address.');
      return;
    }

    onSave({
      ...market,
      name: name.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      operatingDays,
      operatingHours,
      stallsCount: parseInt(stallsCount, 10) || market.stallsCount,
      specialty: specialty.trim(),
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
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#0F172A] mb-1">Neighborhood *</label>
          <input
            type="text"
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
          Save Market Changes
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const { showAlert, showConfirm, showCustomModal } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = searchParams.get('tab');
  const initialTab = urlTab && VALID_TABS.includes(urlTab.toLowerCase())
    ? urlTab.toUpperCase()
    : 'MARKETS';

  const [activeTab, setActiveTabState] = useState(initialTab);
  const [marketsList, setMarketsList] = useState(marketsData);
  const [vendorApps, setVendorApps] = useState(INITIAL_VENDOR_APPLICATIONS);
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);

  // User filtering
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');

  // Keep state synced with URL query param
  useEffect(() => {
    if (urlTab && VALID_TABS.includes(urlTab.toLowerCase())) {
      setActiveTabState(urlTab.toUpperCase());
    }
  }, [urlTab]);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams({ tab: tab.toLowerCase() });
  };

  // 1. Add Market Modal (Fixed prop signature with content)
  const handleOpenAddMarketModal = () => {
    showCustomModal({
      title: 'Register New Farmers Market',
      content: ({ close }) => (
        <AddMarketModalContent
          onClose={close}
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

  // 2. Edit Market Modal
  const handleOpenEditMarketModal = (market) => {
    showCustomModal({
      title: `Edit ${market.name}`,
      content: ({ close }) => (
        <EditMarketModalContent
          market={market}
          onClose={close}
          onSave={(updatedMarket) => {
            setMarketsList((prev) =>
              prev.map((m) => (m.id === updatedMarket.id ? updatedMarket : m))
            );
            showAlert({
              title: 'Market Updated',
              message: `${updatedMarket.name} information has been successfully updated.`,
              type: 'success',
              confirmText: false,
              autoCloseMs: 1800,
            });
          }}
        />
      ),
    });
  };

  // 3. Delete / Deactivate Market
  const handleDeleteMarket = async (marketId, marketName) => {
    const confirmed = await showConfirm({
      title: 'Deactivate Farmers Market?',
      message: `Are you sure you want to deactivate and remove "${marketName}" from the public marketplace? Current active stall allocations will be archived.`,
      confirmText: 'Deactivate Market',
      type: 'danger',
    });
    if (confirmed) {
      setMarketsList((prev) => prev.filter((m) => m.id !== marketId));
      showAlert({
        title: 'Market Deactivated',
        message: `${marketName} has been removed from active public listings.`,
        type: 'info',
        confirmText: false,
        autoCloseMs: 1800,
      });
    }
  };

  // 4. Toggle User Status (Suspend / Reactivate)
  const handleToggleUserStatus = async (userObj) => {
    const willSuspend = userObj.status === 'ACTIVE';
    const confirmed = await showConfirm({
      title: willSuspend ? `Suspend User Account?` : `Reactivate User Account?`,
      message: willSuspend
        ? `Are you sure you want to suspend "${userObj.fullname}" (${userObj.email}) for policy violation? They will be blocked from logging in or placing pre-orders.`
        : `Reactivate "${userObj.fullname}" and restore full platform access?`,
      confirmText: willSuspend ? 'Suspend Account' : 'Reactivate Account',
      type: willSuspend ? 'danger' : 'warning',
    });
    if (confirmed) {
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === userObj.id ? { ...u, status: willSuspend ? 'SUSPENDED' : 'ACTIVE' } : u
        )
      );
      showAlert({
        title: willSuspend ? 'Account Suspended' : 'Account Reactivated',
        message: `${userObj.fullname} has been marked as ${willSuspend ? 'SUSPENDED' : 'ACTIVE'}.`,
        type: willSuspend ? 'danger' : 'success',
        confirmText: false,
        autoCloseMs: 1800,
      });
    }
  };

  // 5. Vendor Application Decision
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

  // 6. Review Moderation Action
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

  // 7. Inquiries Resolution
  const handleToggleInquiryStatus = (msgId) => {
    setInquiries((prev) =>
      prev.map((msg) =>
        msg.id === msgId
          ? { ...msg, status: msg.status === 'NEW' ? 'RESOLVED' : 'NEW' }
          : msg
      )
    );
  };

  // 8. Export Report Simulation
  const handleExportReports = () => {
    showAlert({
      title: 'Audit Report Generated',
      message: 'Platform Metrics & Market Fulfillment Summary (CSV) downloaded successfully.',
      type: 'success',
      confirmText: false,
      autoCloseMs: 2000,
    });
  };

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.fullname.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.phone.includes(userSearchQuery);
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

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
            Oversee local farmers markets, audit family farm credentials, manage user accounts, and review platform performance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF]">
          <button
            type="button"
            onClick={() => setActiveTab('MARKETS')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'VENDORS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stall Apps ({vendorApps.filter((v) => v.status === 'PENDING').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('USERS')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'USERS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({usersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REVIEWS')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'MESSAGES'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inquiries ({inquiries.filter((m) => m.status === 'NEW').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REPORTS')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REPORTS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Reports</span>
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
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Permitted Stalls</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">182</span>
            <span className="text-xs text-blue-600 font-bold ml-2">Farms</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Organic Growers & Creameries</p>
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
            <span className="text-xs text-amber-600 font-bold ml-2">Hold Slots</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">In-person stall settlement</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{usersList.length * 150}</span>
            <span className="text-xs text-purple-600 font-bold ml-2">Active</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Shoppers & verified growers</p>
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
                className="border border-[#E2E8DF] rounded-2xl p-4 bg-[#F8FAF6] space-y-3 hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
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
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8DF] text-[11px]">
                  <span className="text-[#475569] truncate max-w-[170px]">
                    Focus: <span className="font-semibold text-[#0F172A]">{mkt.specialty}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditMarketModal(mkt)}
                      className="p-1.5 rounded-lg border border-[#E2E8DF] bg-white hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] transition cursor-pointer"
                      title="Edit Market Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMarket(mkt.id, mkt.name)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                      title="Deactivate Market"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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

      {/* 5. TAB 3: USER ACCOUNTS & GOVERNANCE (SRS Requirement) */}
      {activeTab === 'USERS' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Platform Users & Account Governance</h2>
              <p className="text-xs text-[#475569]">
                Audit customer and farmer accounts, monitor policy compliance, and activate or suspend accounts as mandated by MarketLink SRS.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {filteredUsers.length} Users Listed
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search by name, email, or contact number..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8DF] bg-white text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E2E8DF] bg-white text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              >
                <option value="ALL">All Roles</option>
                <option value="CUSTOMER">Customers / Shoppers</option>
                <option value="FARMER">Farmers / Growers</option>
                <option value="ADMIN">Platform Admins</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E2E8DF] bg-white text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF6] text-[#475569] font-bold uppercase tracking-wider border-b border-[#E2E8DF]">
                <tr>
                  <th className="py-3 px-4">User / Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location / Stall</th>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8DF] bg-white">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{u.fullname}</div>
                      <div className="text-[11px] text-[#475569] font-mono">{u.email}</div>
                      <div className="text-[10px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'FARMER'
                            ? 'bg-emerald-100 text-[#16A34A]'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] font-medium">
                      {u.neighborhood}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      <div>{u.ordersPlaced} {u.role === 'FARMER' ? 'Stall sales' : 'Pre-orders'}</div>
                      <div className="text-[10px] text-slate-400">Joined: {u.joinedDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#16A34A] border border-emerald-200">
                          <UserCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                          <UserX className="w-3 h-3" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'ADMIN' ? (
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            u.status === 'ACTIVE'
                              ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'bg-[#16A34A] text-white hover:bg-[#15803D]'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB 4: REVIEW MODERATION */}
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

      {/* 7. TAB 5: CONTACT INQUIRIES */}
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

      {/* 8. TAB 6: REPORTS & ANALYTICS (SRS Requirement) */}
      {activeTab === 'REPORTS' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Platform Performance Reports & Fulfillment Analytics</h2>
              <p className="text-xs text-[#475569]">
                Aggregated statistics on pre-order volumes, estimated stall settlements, and top performing family growers.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportReports}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E2E8DF] bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-[#16A34A]" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          {/* Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Gross In-Person Settlement
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">$38,650</div>
              <p className="text-[11px] text-emerald-700 mt-1">Direct cash/card stall volume</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                Order Fulfillment Rate
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-1">98.4%</div>
              <p className="text-[11px] text-blue-700 mt-1">1,397 / 1,420 orders picked up</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Average Stall Turnout
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">29 Stalls / Mkt</div>
              <p className="text-[11px] text-amber-700 mt-1">Capacity utilization: 86.5%</p>
            </div>
          </div>

          {/* Market Performance Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Pre-Order Volume by Chicago Farmers Market Ground
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-[#E2E8DF]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAF6] text-[#475569] font-bold uppercase tracking-wider border-b border-[#E2E8DF]">
                  <tr>
                    <th className="py-3 px-4">Market Ground</th>
                    <th className="py-3 px-4">Active Stalls</th>
                    <th className="py-3 px-4">Weekly Pre-Orders</th>
                    <th className="py-3 px-4">Est. In-Person Cash</th>
                    <th className="py-3 px-4 text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8DF] bg-white">
                  {MARKET_PERFORMANCE_REPORTS.map((rep, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-[#0F172A]">{rep.market}</td>
                      <td className="py-3 px-4 text-[#475569]">{rep.activeStalls} Stalls</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#16A34A]">{rep.preOrders} holds</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0F172A]">{rep.grossEstimate}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#16A34A] font-bold font-mono">
                          {rep.fulfillmentRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performing Family Farms */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Top Ranked Family Farms & Stall Operators (Month to Date)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOP_PERFORMING_FARMS.map((farm, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#E2E8DF] bg-[#F8FAF6] space-y-2 hover:border-emerald-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A]">{farm.farm}</h4>
                      <p className="text-[11px] text-[#475569]">Grower: {farm.grower}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ★ {farm.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF] text-xs">
                    <span className="text-[11px] font-mono font-semibold text-[#16A34A]">
                      {farm.preOrdersFulfilled} Pre-Orders Fulfilled
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] bg-white px-2 py-0.5 rounded-md border border-[#E2E8DF]">
                      {farm.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
