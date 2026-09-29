import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { useFarmerOrders } from '../../hooks/useFarmerOrders';
import { useFarmerProducts } from '../../hooks/useFarmerProducts';
import { useWeeklyStock } from '../../hooks/useWeeklyStock';
import { useFarmerMarkets } from '../../hooks/useFarmerMarkets';
import { useFarmerReviews } from '../../hooks/useFarmerReviews';
import {
  FarmerMetricsCards,
  FarmerOrdersQueueTab,
  FarmerStockTab,
  WeeklyStockTab,
  FarmerMarketsTab,
  FarmerReviewsTab,
  FarmerSettingsTab,
} from '../../components/farmer';

/**
 * FarmerDashboard (Phase 4.14)
 * High-level coordinator page for the Farmer & Stall Master portal.
 * Modular tabs:
 * 1. Pre-Orders Queue (Live State Machine)
 * 2. Stall Stock (Live Produce Inventory CRUD)
 * 3. Weekly Rollover (7-Day Templates & 1-Click Apply)
 * 4. Market Stalls (Registered Farmers Markets & Slots)
 * 5. Customer Reviews (Feedback & Farmer Responses)
 * 6. Stall Settings (Identity & Security)
 */
export default function FarmerDashboard() {
  const { user, updateProfile } = useAuth();
  const { showAlert } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const validTabs = ['queue', 'stock', 'weekly', 'markets', 'reviews', 'settings'];
  const urlTab = searchParams.get('tab');
  const activeTab = urlTab && validTabs.includes(urlTab.toLowerCase())
    ? urlTab.toUpperCase()
    : 'QUEUE';

  const setActiveTab = (tab) => {
    setSearchParams({ tab: tab.toLowerCase() });
  };

  // State Management Custom Hooks (Single Responsibility Principle)
  const farmerOrders = useFarmerOrders();
  const farmerProducts = useFarmerProducts();
  const weeklyStock = useWeeklyStock(farmerProducts.products, farmerProducts.refetch);
  const farmerMarkets = useFarmerMarkets();
  const farmerReviews = useFarmerReviews(user?.farmer?.id, farmerProducts.products);

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

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Live Stall Session Summary */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>{user?.farmer?.stall_name || farmSettings.farmName || 'Farmer Stall'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Farmer & Stall Master Control
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] max-w-3xl leading-relaxed">
            Manage weekend customer pickup crates, coordinate dawn harvest batches, and verify cash settlement at your market stall.
          </p>
        </div>
      </div>

      {/* 2. Key Stall Operational Metrics */}
      <FarmerMetricsCards metrics={farmerOrders.metrics} />

      {/* 3. Tab Contents */}
      {activeTab === 'QUEUE' && (
        <FarmerOrdersQueueTab hook={farmerOrders} />
      )}

      {activeTab === 'STOCK' && (
        <FarmerStockTab hook={farmerProducts} />
      )}

      {activeTab === 'WEEKLY' && (
        <WeeklyStockTab hook={weeklyStock} products={farmerProducts.products} />
      )}

      {activeTab === 'MARKETS' && (
        <FarmerMarketsTab hook={farmerMarkets} />
      )}

      {activeTab === 'REVIEWS' && (
        <FarmerReviewsTab hook={farmerReviews} />
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
