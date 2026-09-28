import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Store, ShoppingBag, Sliders, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { useFarmerOrders } from '../../hooks/useFarmerOrders';
import {
  FarmerMetricsCards,
  FarmerOrdersQueueTab,
  FarmerStockTab,
  FarmerSettingsTab,
} from '../../components/farmer';
import productsData from '../../data/products.json';

// Initial local stock fallback until Phase 4.13 API integration
const INITIAL_STALL_STOCK = productsData.slice(0, 6).map((p) => ({
  ...p,
  stockQty: p.stockKg,
  stockStatus: p.stockKg > 15 ? 'IN_STOCK' : p.stockKg > 0 ? 'LOW_STOCK' : 'SOLD_OUT',
}));

/**
 * FarmerDashboard (Phase 4.12)
 * High-level coordinator page for the Farmer & Stall Master portal.
 * Decomposed into focused tabs: Incoming Pre-Orders Queue, Stall Stock, and Stall Settings.
 */
export default function FarmerDashboard() {
  const { user, updateProfile } = useAuth();
  const { showAlert } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = searchParams.get('tab');
  const activeTab = urlTab && ['queue', 'stock', 'settings'].includes(urlTab.toLowerCase())
    ? urlTab.toUpperCase()
    : 'QUEUE';

  const setActiveTab = (tab) => {
    setSearchParams({ tab: tab.toLowerCase() });
  };

  const farmerOrders = useFarmerOrders();
  const [stockList, setStockList] = useState(INITIAL_STALL_STOCK);
  const [farmSaving, setFarmSaving] = useState(false);

  // Farm Profile Settings
  const [farmSettings, setFarmSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('marketlink_farmer_stall_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
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

  const handleToggleStockStatus = (prodId, status) => {
    setStockList((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, stockStatus: status } : p))
    );
  };

  const activeQueueCount = farmerOrders.metrics.activeCount;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Live Stall Session Summary */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>{user?.farmer?.stall_name || farmSettings.farmName || 'Farmer Stall'}</span>
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
            <span>Pickup Queue ({activeQueueCount})</span>
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
      <FarmerMetricsCards metrics={farmerOrders.metrics} />

      {/* 3. Tab Contents */}
      {activeTab === 'QUEUE' && (
        <FarmerOrdersQueueTab hook={farmerOrders} />
      )}

      {activeTab === 'STOCK' && (
        <FarmerStockTab
          stockList={stockList}
          onAdjustStock={handleAdjustStock}
          onToggleStockStatus={handleToggleStockStatus}
        />
      )}

      {activeTab === 'SETTINGS' && (
        <FarmerSettingsTab
          farmSettings={farmSettings}
          setFarmSettings={setFarmSettings}
          onSaveFarmSettings={handleSaveFarmSettings}
          farmSaving={farmSaving}
        />
      )}
    </div>
  );
}
