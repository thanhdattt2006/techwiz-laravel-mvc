import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productsData from '../../data/products.json';
import marketsData from '../../data/markets.json';
import {
  ShoppingBag,
  Store,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Sprout,
  CheckCircle2,
  DollarSign,
  Heart,
  Navigation,
  Sparkles,
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();

  // Mock upcoming active reservation
  const activePickup = {
    code: 'MLB-2026-8819',
    marketName: 'Green City Market',
    neighborhood: 'Lincoln Park',
    stallNumber: 'Stall #04',
    farmerName: 'Prairie Organic Grove (Sarah Jenkins)',
    pickupDate: 'Saturday, Oct 24',
    pickupSlot: '08:00 AM - 10:00 AM',
    status: 'Ready for Pickup',
    statusColor: 'emerald',
    items: [
      { name: 'Organic Heirloom Tomatoes', qty: 2, unit: 'lbs', price: 9.0 },
      { name: 'Raw Wildflower Honey', qty: 1, unit: 'jar', price: 9.5 },
    ],
    cashTotal: 18.5,
  };

  // Recommended seasonal picks (3 items from products.json)
  const seasonalRecommendations = productsData.slice(0, 3);

  // Favorite markets (first 2 markets)
  const favoriteMarkets = marketsData.slice(0, 2);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#16A34A] to-[#15803D] text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
              <Sprout className="w-3.5 h-3.5 text-emerald-200" />
              <span>Certified Community Shopper • eGreen Basket</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.fullname || 'Harvest Explorer'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Your weekend pre-orders are tracked below. Remember: all reservations are held fresh at local market stalls for cash inspection upon pickup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#16A34A] font-bold text-xs hover:bg-emerald-50 transition shadow-xs"
            >
              <Store className="w-4 h-4" />
              <span>Order Harvest</span>
            </Link>
            <Link
              to="/markets"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-sm transition"
            >
              <MapPin className="w-4 h-4 text-emerald-200" />
              <span>Find Markets</span>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 2. Key Ecological & Reservation Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Active Pickups</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">2</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">Awaiting pickup</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Confirmed for this weekend</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Farms Supported</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">4</span>
            <span className="text-xs text-amber-600 font-bold ml-2">Family Farms</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Zero long-haul food miles</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Produce Claimed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">16.5</span>
            <span className="text-xs text-[#16A34A] font-bold ml-2">lbs Fresh</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">100% Organically grown</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Cash at Stalls</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">$38.50</span>
            <span className="text-xs text-blue-600 font-bold ml-2">Due in Person</span>
          </div>
          <p className="text-[11px] text-[#475569] mt-1">Inspect first, pay at stall</p>
        </div>
      </div>

      {/* 3. Upcoming Stall Pickup Highlight */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Next Scheduled Pickup</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {activePickup.marketName} • {activePickup.stallNumber}
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Grower: {activePickup.farmerName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/tracking/${activePickup.code}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition"
            >
              <span>Live Pickup Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pickup Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF]">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#475569] uppercase">Pickup Date & Time</p>
              <p className="text-xs font-bold text-[#0F172A]">{activePickup.pickupDate}</p>
              <p className="text-[11px] text-[#16A34A] font-semibold">{activePickup.pickupSlot}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#475569] uppercase">Stall Coordinates</p>
              <p className="text-xs font-bold text-[#0F172A]">{activePickup.stallNumber} • Row A (North Entrance)</p>
              <p className="text-[11px] text-[#475569]">Green City Market Grounds</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#475569] uppercase">Inspection Cash Slip</p>
              <p className="text-xs font-bold text-[#0F172A]">${activePickup.cashTotal.toFixed(2)} USD</p>
              <p className="text-[11px] text-amber-700 font-medium">Cash/Card accepted at stall</p>
            </div>
          </div>
        </div>

        {/* Reserved items in tote */}
        <div>
          <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">
            Items Reserved in Harvest Tote ({activePickup.code})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activePickup.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8DF] bg-white text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span className="font-bold text-[#0F172A]">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#0F172A]">
                    {item.qty} {item.unit}
                  </span>
                  <span className="text-[#475569] ml-2">(${item.price.toFixed(2)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Seasonal Recommendations & Favorite Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Harvest */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8DF] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-[#0F172A]">In Season This Week</h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
            >
              <span>Explore all {productsData.length} items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {seasonalRecommendations.map((prod) => (
              <div
                key={prod.id}
                className="group border border-[#E2E8DF] rounded-2xl overflow-hidden hover:shadow-md transition bg-white flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#16A34A] backdrop-blur-xs">
                    {prod.category}
                  </span>
                </div>
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#16A34A] transition">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-[#475569]">{prod.farm}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF]">
                    <span className="text-xs font-black text-[#0F172A]">
                      ${prod.price.toFixed(2)}{' '}
                      <span className="text-[10px] font-normal text-[#475569]">/{prod.unit}</span>
                    </span>
                    <Link
                      to={`/products/${prod.id}`}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#16A34A] hover:bg-[#16A34A] hover:text-white font-bold text-[11px] transition"
                    >
                      Pre-Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Markets */}
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#16A34A]" />
              <h2 className="text-base font-bold text-[#0F172A]">Favorite Markets</h2>
            </div>
            <Link
              to="/markets"
              className="text-xs font-bold text-[#16A34A] hover:underline"
            >
              All 6
            </Link>
          </div>

          <div className="space-y-3">
            {favoriteMarkets.map((mkt) => (
              <div
                key={mkt.id}
                className="p-3.5 rounded-2xl border border-[#E2E8DF] bg-[#F8FAF6] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0F172A]">{mkt.name}</h4>
                  <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-100 px-2 py-0.5 rounded-full">
                    {mkt.stallsCount} Stalls
                  </span>
                </div>
                <div className="text-[11px] text-[#475569] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span className="truncate">{mkt.neighborhood} • {mkt.address}</span>
                </div>
                <div className="text-[11px] text-[#475569] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>{mkt.operatingDays} ({mkt.operatingHours})</span>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <Link
                    to="/markets"
                    className="text-[11px] font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                  >
                    <span>View Stalls</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${mkt.name}, ${mkt.address}, ${mkt.city}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#475569] hover:text-[#0F172A] flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Map</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
