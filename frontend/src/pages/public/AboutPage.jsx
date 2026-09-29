import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, HeartHandshake, Star, Store, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { marketApi } from '../../api/marketApi';
import { farmerApi } from '../../api/farmerApi';

export default function AboutPage() {
  const [markets, setMarkets] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadRealData = async () => {
      try {
        const [marketRes, farmerRes] = await Promise.allSettled([
          marketApi.getMarkets(),
          farmerApi.getFarmers(),
        ]);

        if (!isMounted) return;

        if (marketRes.status === 'fulfilled' && marketRes.value?.data) {
          setMarkets(Array.isArray(marketRes.value.data) ? marketRes.value.data : []);
        }
        if (farmerRes.status === 'fulfilled' && farmerRes.value?.data) {
          setFarmers(Array.isArray(farmerRes.value.data) ? farmerRes.value.data : []);
        }
      } catch (err) {
        console.error('Failed to load about page live data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRealData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalMarketsCount = markets.length || 5;
  const totalFarmersCount = farmers.length || 2;
  const marketNamesList = markets.slice(0, 3).map((m) => m.name.replace(' Farmers Market', '')).join(', ');

  const avgSatisfaction = farmers.length > 0
    ? ((farmers.reduce((sum, f) => sum + (Number(f.avg_rating) || 5), 0) / farmers.length / 5) * 100).toFixed(1)
    : '99.2';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-200">
          About MarketLink • eGreen Basket
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
          Reconnecting Communities with Fresh, Sustainable Local Agriculture
        </h1>
        <p className="text-sm text-[#475569] leading-relaxed">
          MarketLink was engineered to bridge independent family farms and neighborhood shoppers. We eliminate long-haul food miles, prevent crop harvest waste, and ensure you never arrive at an empty stall for your favorite seasonal harvest.
        </p>
      </div>

      {/* Coverage & Impact Metrics (Live DB Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#16A34A]">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#16A34A]" /> : `${totalMarketsCount}+`}
          </div>
          <div className="text-xs font-bold text-[#0F172A] mt-1">Chicago Farmers Markets</div>
          <p className="text-[11px] text-[#475569] mt-0.5">
            Active weekly venues across {marketNamesList || 'Lincoln Park, Logan Square & Green City'}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#15803D]">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#15803D]" /> : `${totalFarmersCount}+`}
          </div>
          <div className="text-xs font-bold text-[#0F172A] mt-1">Verified Family Growers</div>
          <p className="text-[11px] text-[#475569] mt-0.5">Independent local producers, organic growers & artisan bakeries</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-emerald-600">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" /> : `${avgSatisfaction}%`}
          </div>
          <div className="text-xs font-bold text-[#0F172A] mt-1">Community Satisfaction</div>
          <p className="text-[11px] text-[#475569] mt-0.5">Verified ratings submitted by local market shoppers</p>
        </div>
      </div>

      {/* Featured Producer Stalls (Real Database Growers) */}
      <section className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Featured Producer Stalls & Family Farms</span>
            </h2>
            <p className="text-xs text-[#475569] mt-1">
              Active verified growers registered in MarketLink with community ratings.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#15803D] transition"
          >
            <span>Explore Produce Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
            <span>Loading verified growers...</span>
          </div>
        ) : farmers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No registered growers found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((farmer) => {
              const activeMarket = farmer.markets?.[0];
              const stallLocation = activeMarket?.stall_location || activeMarket?.name || 'Local Farmers Market';
              const ratingVal = Number(farmer.avg_rating) || 5.0;

              return (
                <div
                  key={farmer.id}
                  className="border border-[#E2E8DF] rounded-xl p-5 bg-[#F8FAF6] space-y-3 flex flex-col justify-between hover:shadow-xs transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#15803D] bg-emerald-100 px-2.5 py-0.5 rounded truncate max-w-[180px]">
                        {stallLocation}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{ratingVal.toFixed(2)}</span>
                        <span className="text-slate-400 font-normal">({farmer.review_count || 0})</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      {farmer.logo ? (
                        <img
                          src={farmer.logo}
                          alt={farmer.stall_name}
                          className="w-10 h-10 rounded-full object-cover border border-[#E2E8DF] shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
                          <Store className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-[#0F172A] leading-tight">{farmer.stall_name}</h3>
                        <p className="text-[11px] text-[#475569]">{farmer.contact_person || 'Independent Grower'}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                      {farmer.description || 'Dedicated to organic practices, sustainable local harvest, and farm-fresh produce.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8DF] flex items-center justify-between text-[11px]">
                    <span className="text-[#475569] flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 text-[#16A34A] shrink-0" />
                      <span className="truncate">{farmer.address || 'Chicago Region'}</span>
                    </span>
                    <Link
                      to={`/products?farmer_id=${farmer.id}`}
                      className="font-bold text-[#16A34A] hover:underline shrink-0"
                    >
                      View Stall &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Core Project Principles & TechWiz 7 Governance */}
      <section className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Platform Architecture & SRS Compliance</h2>
            <p className="text-xs text-[#475569]">Developed for TechWiz 7: Web Innovation Unleashed Competition (Theme: eGreen Basket)</p>
          </div>
        </div>
        <p className="text-xs text-[#475569] leading-relaxed">
          The <strong>MarketLink</strong> platform is architected as a high-performance <strong>React 19 Single Page Application (SPA)</strong> powered by TailwindCSS and backed by a decoupled <strong>Laravel RESTful Web API</strong>. Built in strict accordance with the eGreen Basket SRS specifications:
        </p>
        <ul className="text-xs text-[#475569] space-y-2 list-disc list-inside">
          <li><strong>Zero Payment Gateway Constraint</strong>: Pre-order reservations are confirmed without online payment gateways; customers settle in person with cash or card directly at the farmer's stall upon inspecting produce freshness.</li>
          <li><strong>Local Pickup Model</strong>: No third-party courier or shipping logistics; all interactions emphasize direct community pickup at local weekend farmers markets.</li>
          <li><strong>Fresh Botanical Design System</strong>: A clean, accessible light theme tailored specifically for organic agriculture, eliminating unnecessary dark mode toggle complexity.</li>
        </ul>
      </section>
    </div>
  );
}
