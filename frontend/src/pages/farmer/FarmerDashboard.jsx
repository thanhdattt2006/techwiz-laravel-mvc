import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import productsData from '../../data/products.json';
import {
  Store,
  ShoppingBag,
  DollarSign,
  Sprout,
  CheckCircle2,
  Search,
  TrendingUp,
  Sliders,
  Check,
  Settings,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  User,
  Phone,
  Clock,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { StatusBadge } from '../../components/common';

const INITIAL_QUEUE = [
  {
    id: 'MLB-2026-8819',
    customerName: 'Elena Rostova',
    customerPhone: '(312) 555-7821',
    pickupSlot: '08:00 AM - 10:00 AM',
    status: 'Ready for Pickup',
    statusStep: 4,
    items: [
      { name: 'Organic Heirloom Tomatoes', qty: 2, unit: 'lbs', price: 9.0 },
      { name: 'Raw Wildflower Honey', qty: 1, unit: 'jar', price: 9.5 },
    ],
    cashDue: 18.5,
    customerNotes: 'Prefers firm, ripe red tomatoes. Bringing own cloth tote.',
    crateNumber: 'TOTE-A04',
  },
  {
    id: 'MLB-2026-7734',
    customerName: 'Marcus Vance',
    customerPhone: '(312) 555-4309',
    pickupSlot: '09:00 AM - 11:00 AM',
    status: 'Harvested & Packed',
    statusStep: 3,
    items: [
      { name: 'Rainbow Chard & Baby Greens', qty: 2, unit: 'bunches', price: 7.0 },
      { name: 'Honeycrisp Apples', qty: 3, unit: 'lbs', price: 10.5 },
    ],
    cashDue: 17.5,
    customerNotes: 'Will arrive around 09:30 AM before market gets crowded.',
    crateNumber: 'TOTE-A12',
  },
  {
    id: 'MLB-2026-6210',
    customerName: 'Sophia Lin',
    customerPhone: '(312) 555-9088',
    pickupSlot: '10:00 AM - 12:00 PM',
    status: 'Farmer Confirmed',
    statusStep: 2,
    items: [
      { name: 'Hydroponic Baby Spinach', qty: 2, unit: 'bags', price: 7.5 },
      { name: 'Sugar Snap Peas', qty: 1, unit: 'lb', price: 4.5 },
    ],
    cashDue: 12.0,
    customerNotes: 'First time visitor to Green City Market!',
    crateNumber: 'TOTE-B01',
  },
  {
    id: 'MLB-2026-5109',
    customerName: 'David K. Miller',
    customerPhone: '(312) 555-1234',
    pickupSlot: '08:00 AM - 10:00 AM',
    status: 'Completed',
    statusStep: 5,
    items: [
      { name: 'Sweet Golden Peaches', qty: 4, unit: 'lbs', price: 15.0 },
    ],
    cashDue: 15.0,
    customerNotes: 'Paid cash in full at 08:25 AM.',
    crateNumber: 'TOTE-DONE',
  },
];

// 6 products for Prairie Organic Grove
const INITIAL_STALL_STOCK = productsData.slice(0, 6).map((p) => ({
  ...p,
  stockQty: p.stockKg,
  stockStatus: p.stockKg > 15 ? 'IN_STOCK' : p.stockKg > 0 ? 'LOW_STOCK' : 'SOLD_OUT',
}));

export default function FarmerDashboard() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showAlert, showConfirm } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = searchParams.get('tab');
  const activeTab = urlTab && ['queue', 'stock', 'settings'].includes(urlTab.toLowerCase())
    ? urlTab.toUpperCase()
    : 'QUEUE';

  const setActiveTab = (tab) => {
    setSearchParams({ tab: tab.toLowerCase() });
  };

  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [stockList, setStockList] = useState(INITIAL_STALL_STOCK);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrderForSettle, setSelectedOrderForSettle] = useState(null);

  // Farm Profile State
  const [farmSettings, setFarmSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('marketlink_farmer_stall_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      farmName: 'Prairie Organic Grove',
      farmerName: user?.fullname || 'Marcus Jenkins (Grower)',
      phone: user?.phone || '(312) 555-4421',
      marketAssigned: 'Green City Market • Stall #04',
      operatingHours: 'Saturdays: 07:00 AM – 01:00 PM',
      autoAcceptPreOrders: true,
      notifyFridayCutoff: true,
      notifyShopperCrateReady: true,
    };
  });

  // Password State
  const [farmerPassword, setFarmerPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showFarmerPassword, setShowFarmerPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [farmSaving, setFarmSaving] = useState(false);
  const [farmerPassLoading, setFarmerPassLoading] = useState(false);

  // Handlers for Stall Settings
  const handleSaveFarmSettings = async (e) => {
    e.preventDefault();
    setFarmSaving(true);
    await updateProfile({
      fullname: farmSettings.farmerName,
      phone: farmSettings.phone,
    });
    localStorage.setItem('marketlink_farmer_stall_settings', JSON.stringify(farmSettings));
    setFarmSaving(false);
    showAlert({
      title: 'Stall Settings Saved',
      message: 'Your farm identity, operating hours, and pre-order parameters have been updated.',
      type: 'success',
      confirmText: false,
      autoCloseMs: 2000,
    });
  };

  const handleFarmerChangePassword = async (e) => {
    e.preventDefault();
    if (!farmerPassword.currentPassword) {
      showAlert({
        title: 'Missing Current Password',
        message: 'Please enter your current Stall Master password.',
        type: 'danger',
      });
      return;
    }
    if (!farmerPassword.newPassword || farmerPassword.newPassword.length < 6) {
      showAlert({
        title: 'Password Too Short',
        message: 'New password must be at least 6 characters long.',
        type: 'danger',
      });
      return;
    }
    if (farmerPassword.newPassword !== farmerPassword.confirmPassword) {
      showAlert({
        title: 'Password Mismatch',
        message: 'New password and confirmation do not match.',
        type: 'danger',
      });
      return;
    }

    setFarmerPassLoading(true);
    const result = await changePassword({
      currentPassword: farmerPassword.currentPassword,
      newPassword: farmerPassword.newPassword,
      confirmPassword: farmerPassword.confirmPassword,
    });
    setFarmerPassLoading(false);

    if (result.success) {
      setFarmerPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showAlert({
        title: 'Password Updated',
        message: result.message || 'Stall Master account credentials updated successfully.',
        type: 'success',
        confirmText: false,
        autoCloseMs: 2200,
      });
    } else {
      showAlert({
        title: 'Update Failed',
        message: result.message || 'Could not update password.',
        type: 'danger',
      });
    }
  };

  // Filtered Queue
  const filteredQueue = queue.filter((order) => {
    const matchesFilter =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'PENDING'
        ? order.status === 'Farmer Confirmed' || order.status === 'Harvested & Packed'
        : statusFilter === 'READY'
        ? order.status === 'Ready for Pickup'
        : order.status === 'Completed';

    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q);

    return matchesFilter && matchesSearch;
  });

  // Action: Advance order status
  const handleAdvanceStatus = (orderId, newStatus, newStep) => {
    setQueue((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, statusStep: newStep } : o))
    );
    showAlert({
      title: 'Order Status Updated',
      message: `Reservation ${orderId} has been updated to "${newStatus}". Customer notification queued!`,
      type: 'success',
      confirmText: false,
      autoCloseMs: 1800,
    });
  };

  // Action: Confirm cash settlement
  const handleConfirmCashSettlement = (order) => {
    setQueue((prev) =>
      prev.map((o) =>
        o.id === order.id ? { ...o, status: 'Completed', statusStep: 5 } : o
      )
    );
    setSelectedOrderForSettle(null);
    showAlert({
      title: 'Cash Collected & Order Completed',
      message: `Successfully collected $${order.cashDue.toFixed(2)} USD cash for order ${order.id}. Inspection cleared!`,
      type: 'success',
      confirmText: false,
      autoCloseMs: 2200,
    });
  };

  // Action: Cancel reservation
  const handleCancelOrder = async (orderId) => {
    const confirmed = await showConfirm({
      title: 'Cancel Reservation?',
      message: `Are you sure you want to cancel ${orderId}? An SMS notification will be sent to the customer immediately.`,
      type: 'danger',
      confirmText: 'Yes, Cancel Order',
      cancelText: 'Keep Order',
    });

    if (confirmed) {
      setQueue((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled', statusStep: 0 } : o))
      );
      showAlert({
        title: 'Order Cancelled',
        message: `Order ${orderId} has been cancelled and customer notified.`,
        type: 'info',
        confirmText: false,
        autoCloseMs: 1800,
      });
    }
  };

  // Action: Adjust Stock Qty
  const handleAdjustStock = (prodId, delta) => {
    setStockList((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const newQty = Math.max(0, p.stockQty + delta);
          const newStatus = newQty > 10 ? 'IN_STOCK' : newQty > 0 ? 'LOW_STOCK' : 'SOLD_OUT';
          return { ...p, stockQty: newQty, stockStatus: newStatus };
        }
        return p;
      })
    );
  };

  // Action: Toggle Stock Status
  const handleToggleStockStatus = (prodId, status) => {
    setStockList((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, stockStatus: status } : p))
    );
  };

  // Metrics
  const activeOrdersCount = queue.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const estimatedStallCash = queue
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.cashDue, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Live Stall Session Summary */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>Prairie Organic Grove • Stall #04</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Farmer & Stall Master Control
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Manage weekend customer pickup crates, coordinate dawn harvest batches, and verify cash settlement at your market stall.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] self-start md:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('QUEUE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'QUEUE'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pickup Queue ({activeOrdersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STOCK')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'STOCK'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Stall Stock ({stockList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'SETTINGS'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Stall Settings</span>
          </button>
        </div>
      </div>

      {/* 2. Key Stall Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Active Queue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{activeOrdersCount}</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">Crates held</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Pending in-person pickup</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Stall Cash Total</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              ${estimatedStallCash.toFixed(2)}
            </span>
            <span className="text-xs text-blue-600 font-bold ml-2">Estimated</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Zero online gateway fees</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Harvest Volume</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">142.5</span>
            <span className="text-xs text-amber-600 font-bold ml-2">lbs Picked</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Dawn harvest from farm</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Fulfillment</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">96.5%</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">On-Time</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Stall inspection attendance</p>
        </div>
      </div>

      {/* 3. TAB 1: INCOMING PRE-ORDERS QUEUE */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-6">
          {/* Controls: Filter & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === 'ALL'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
                }`}
              >
                All Orders ({queue.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === 'PENDING'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
                }`}
              >
                In Harvest & Packing (2)
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('READY')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === 'READY'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
                }`}
              >
                Ready at Stall (1)
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('COMPLETED')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
                }`}
              >
                Completed & Cash Paid (1)
              </button>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer or code..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8DF] bg-white text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Queue Cards */}
          <div className="space-y-4">
            {filteredQueue.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-[#E2E8DF] rounded-3xl p-6 shadow-xs hover:border-emerald-300 transition space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-[#0F172A]">{ord.id}</span>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-[#475569] border border-slate-200">
                        {ord.crateNumber}
                      </span>
                      <StatusBadge status={ord.status} />
                    </div>
                    <p className="text-xs text-[#475569]">
                      Customer: <strong>{ord.customerName}</strong> • Phone:{' '}
                      <span className="font-mono text-[#0F172A]">{ord.customerPhone}</span>
                    </p>
                  </div>

                  {/* Right side Cash & Actions */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#475569] block">Cash Due</span>
                      <span className="text-base font-black text-[#16A34A]">${ord.cashDue.toFixed(2)}</span>
                    </div>

                    {ord.status !== 'Completed' && ord.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForSettle(ord)}
                        className="px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Settle Cash</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Scheduled Window */}
                  <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1">
                    <span className="font-bold text-[#475569] uppercase text-[10px]">Pickup Window</span>
                    <p className="font-bold text-[#0F172A]">{ord.pickupSlot}</p>
                    <p className="text-[11px] text-[#475569]">Green City Market - Stall #04</p>
                  </div>

                  {/* Customer Packing Notes */}
                  <div className="p-3.5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8DF] space-y-1 md:col-span-2">
                    <span className="font-bold text-[#475569] uppercase text-[10px]">Packing Instructions</span>
                    <p className="text-xs text-[#0F172A] italic">"{ord.customerNotes}"</p>
                  </div>
                </div>

                {/* Items in Tote */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                    Produce Items to Inspect ({ord.items.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ord.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8DF] bg-white text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span className="font-bold text-[#0F172A]">{it.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#0F172A]">
                            {it.qty} {it.unit}
                          </span>
                          <span className="text-[#475569] ml-2">(${it.price.toFixed(2)})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Advancement Stepper Buttons */}
                {ord.status !== 'Completed' && ord.status !== 'Cancelled' && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8DF]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#475569]">Advance Status:</span>

                      {ord.status === 'Farmer Confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStatus(ord.id, 'Harvested & Packed', 3)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition cursor-pointer"
                        >
                          Mark Harvested & Packed
                        </button>
                      )}

                      {ord.status === 'Harvested & Packed' && (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStatus(ord.id, 'Ready for Pickup', 4)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] border border-emerald-200 text-xs font-bold transition cursor-pointer"
                        >
                          Mark Ready at Stall
                        </button>
                      )}

                      {ord.status === 'Ready for Pickup' && (
                        <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Held at Stall #04 awaiting customer arrival
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCancelOrder(ord.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 transition cursor-pointer"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: WEEKLY STALL STOCK MANAGER */}
      {activeTab === 'STOCK' && (
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Weekly Stall Produce Stock</h2>
              <p className="text-xs text-[#475569]">
                Adjust live quantities brought to Green City Market. Customers will see real-time availability in the public catalog.
              </p>
            </div>
            <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              6 Active Harvest Listings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stockList.map((item) => (
              <div
                key={item.id}
                className="border border-[#E2E8DF] rounded-2xl p-4 bg-[#F8FAF6] space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E2E8DF]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{item.name}</h4>
                      <p className="text-[11px] text-[#475569]">{item.category} • {item.harvestWindow}</p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#16A34A]">${item.price.toFixed(2)}/{item.unit}</span>
                </div>

                {/* Stock Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#475569]">Available:</span>
                    <div className="inline-flex items-center border border-[#E2E8DF] rounded-xl bg-white">
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="px-2.5 py-1 text-xs font-bold text-[#475569] hover:bg-slate-100 rounded-l-xl transition cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-[#0F172A] font-mono">
                        {item.stockQty} {item.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.id, 1)}
                        className="px-2.5 py-1 text-xs font-bold text-[#475569] hover:bg-slate-100 rounded-r-xl transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stock Status Pills */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleStockStatus(item.id, 'IN_STOCK')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        item.stockStatus === 'IN_STOCK'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-[#475569] border border-[#E2E8DF]'
                      }`}
                    >
                      In Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStockStatus(item.id, 'LOW_STOCK')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        item.stockStatus === 'LOW_STOCK'
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-[#475569] border border-[#E2E8DF]'
                      }`}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStockStatus(item.id, 'SOLD_OUT')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        item.stockStatus === 'SOLD_OUT'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white text-[#475569] border border-[#E2E8DF]'
                      }`}
                    >
                      Sold Out
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 3: STALL & FARMER SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="space-y-6">
          {/* Farm & Stall Master Identity */}
          <form onSubmit={handleSaveFarmSettings} className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
              <div className="flex items-center gap-2.5">
                <Store className="w-5 h-5 text-[#16A34A]" />
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Farm & Stall Master Identity</h2>
                  <p className="text-[11px] text-[#475569]">Public information displayed on your stall banner and customer pickup receipts</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#16A34A] font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 uppercase">
                ROLE: STALL MASTER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="farm-name-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Farm / Brand Name</span>
                </label>
                <input
                  id="farm-name-input"
                  type="text"
                  value={farmSettings.farmName}
                  onChange={(e) => setFarmSettings({ ...farmSettings, farmName: e.target.value })}
                  placeholder="e.g. Prairie Organic Grove"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="farmer-name-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Lead Grower / Stall Master Name</span>
                </label>
                <input
                  id="farmer-name-input"
                  type="text"
                  value={farmSettings.farmerName}
                  onChange={(e) => setFarmSettings({ ...farmSettings, farmerName: e.target.value })}
                  placeholder="e.g. Marcus Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="farmer-phone-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Emergency Stall Phone Hotline</span>
                </label>
                <input
                  id="farmer-phone-input"
                  type="tel"
                  value={farmSettings.phone}
                  onChange={(e) => setFarmSettings({ ...farmSettings, phone: e.target.value })}
                  placeholder="(312) 555-4421"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="market-assigned-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Assigned Market & Stall Number</span>
                </label>
                <input
                  id="market-assigned-input"
                  type="text"
                  value={farmSettings.marketAssigned}
                  onChange={(e) => setFarmSettings({ ...farmSettings, marketAssigned: e.target.value })}
                  placeholder="e.g. Green City Market • Stall #04"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="operating-hours-input" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Weekend Stall Operating Hours</span>
                </label>
                <input
                  id="operating-hours-input"
                  type="text"
                  value={farmSettings.operatingHours}
                  onChange={(e) => setFarmSettings({ ...farmSettings, operatingHours: e.target.value })}
                  placeholder="Saturdays: 07:00 AM – 01:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            {/* Operational Preferences */}
            <div className="pt-4 border-t border-[#E2E8DF] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Stall Pre-Order Automation</h3>
              
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={farmSettings.autoAcceptPreOrders}
                  onChange={(e) => setFarmSettings({ ...farmSettings, autoAcceptPreOrders: e.target.checked })}
                  className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">Auto-Confirm Valid Reservation Requests</span>
                  <p className="text-[#475569] text-[11px] mt-0.5">Automatically mark incoming orders as "Farmer Confirmed" if stock is available.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={farmSettings.notifyFridayCutoff}
                  onChange={(e) => setFarmSettings({ ...farmSettings, notifyFridayCutoff: e.target.checked })}
                  className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">Enforce Friday 6:00 PM Harvest Cutoff</span>
                  <p className="text-[#475569] text-[11px] mt-0.5">Locks catalog modifications after dawn picking begins so crate quantities stay accurate.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E2E8DF] hover:bg-[#F8FAF6] transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={farmSettings.notifyShopperCrateReady}
                  onChange={(e) => setFarmSettings({ ...farmSettings, notifyShopperCrateReady: e.target.checked })}
                  className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">Automated SMS When Crate is Ready</span>
                  <p className="text-[#475569] text-[11px] mt-0.5">Sends pickup crate code to customer when status changes to "Ready for Pickup".</p>
                </div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={farmSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{farmSaving ? 'Saving...' : 'Save Stall Settings'}</span>
              </button>
            </div>
          </form>

          {/* Stall Master Security & Change Password */}
          <form onSubmit={handleFarmerChangePassword} className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#16A34A]" />
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Stall Master Security & Change Password</h2>
                  <p className="text-[11px] text-[#475569]">Update your access credentials for market stall management</p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label htmlFor="farmer-curr-pass" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Current Password</span>
                </label>
                <div className="relative">
                  <input
                    id="farmer-curr-pass"
                    type={showFarmerPassword.current ? 'text' : 'password'}
                    value={farmerPassword.currentPassword}
                    onChange={(e) => setFarmerPassword({ ...farmerPassword, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFarmerPassword({ ...showFarmerPassword, current: !showFarmerPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showFarmerPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Demo account: password123</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="farmer-new-pass" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    id="farmer-new-pass"
                    type={showFarmerPassword.new ? 'text' : 'password'}
                    value={farmerPassword.newPassword}
                    onChange={(e) => setFarmerPassword({ ...farmerPassword, newPassword: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFarmerPassword({ ...showFarmerPassword, new: !showFarmerPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showFarmerPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#475569]">Must be at least 6 characters</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="farmer-confirm-pass" className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    id="farmer-confirm-pass"
                    type={showFarmerPassword.confirm ? 'text' : 'password'}
                    value={farmerPassword.confirmPassword}
                    onChange={(e) => setFarmerPassword({ ...farmerPassword, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFarmerPassword({ ...showFarmerPassword, confirm: !showFarmerPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showFarmerPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {farmerPassword.confirmPassword && (
                  <p className={`text-[10px] font-bold ${farmerPassword.newPassword === farmerPassword.confirmPassword ? 'text-[#16A34A]' : 'text-rose-500'}`}>
                    {farmerPassword.newPassword === farmerPassword.confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={farmerPassLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>{farmerPassLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. MODAL: CONFIRM CASH SETTLEMENT AT STALL */}
      {selectedOrderForSettle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8DF] space-y-6 relative animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-[#CBD5E1]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A]">Confirm Stall Cash Settlement</h3>
              <p className="text-xs text-[#475569]">
                Order Code: <span className="font-mono font-bold text-[#0F172A]">{selectedOrderForSettle.id}</span>
              </p>
            </div>

            <div className="space-y-3 text-xs bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF]">
              <div className="flex justify-between">
                <span className="text-[#475569]">Customer:</span>
                <span className="font-bold text-[#0F172A]">{selectedOrderForSettle.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Contact Phone:</span>
                <span className="font-mono font-bold text-[#0F172A]">{selectedOrderForSettle.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Assigned Crate:</span>
                <span className="font-bold text-[#16A34A]">{selectedOrderForSettle.crateNumber}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-[#E2E8DF]">
                <span>Cash to Collect:</span>
                <span className="text-base text-[#16A34A]">
                  ${selectedOrderForSettle.cashDue.toFixed(2)} USD
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#475569] text-center">
              Has the customer inspected the produce and handed the exact cash or tapped the card reader?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForSettle(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => handleConfirmCashSettlement(selectedOrderForSettle)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Paid & Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
