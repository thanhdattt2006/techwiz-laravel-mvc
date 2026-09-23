import React from 'react';
import { Award, HeartHandshake, Star } from 'lucide-react';

export default function AboutPage() {
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

      {/* Coverage & Impact Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#16A34A]">6+</div>
          <div className="text-xs font-bold text-[#0F172A] mt-1">Chicago Farmers Markets</div>
          <p className="text-[11px] text-[#475569] mt-0.5">Active weekly markets across Lincoln Park, Logan Square & Green City</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#15803D]">100%</div>
          <div className="text-xs font-bold text-[#0F172A] mt-1">Direct Family Growers</div>
          <p className="text-[11px] text-[#475569] mt-0.5">Independent local producers, organic growers & artisan bakeries</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-[#F59E0B]">0 mi</div>
          <div className="text-xs font-bold text-[#0F172A] mt-1">Long-Haul Food Miles</div>
          <p className="text-[11px] text-[#475569] mt-0.5">Locally grown within 100 miles, harvested hours before pickup</p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black text-emerald-600">99.2%</div>
          <div className="text-xs font-bold text-[#0F172A] mt-1">Community Satisfaction</div>
          <p className="text-[11px] text-[#475569] mt-0.5">Verified ratings submitted by local market shoppers</p>
        </div>
      </div>

      {/* Best Performing Producer Stalls */}
      <section className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Featured Producer Stalls & Family Farms</span>
          </h2>
          <p className="text-xs text-[#475569] mt-1">
            Recognized for agricultural excellence, organic stewardship, and exceptional pre-order fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#E2E8DF] rounded-xl p-5 bg-[#F8FAF6] space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-[#15803D] bg-emerald-100 px-2.5 py-0.5 rounded">
                Stall #04 • Lincoln Park
              </span>
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.98 Rating
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Green Valley Organics</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              3rd-generation family grower specializing in heirloom tomatoes, tender microgreens, and seasonal squash. Harvested fresh at dawn on market day.
            </p>
          </div>

          <div className="border border-[#E2E8DF] rounded-xl p-5 bg-[#F8FAF6] space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
                Stall #12 • Green City
              </span>
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.95 Rating
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Sunny Ridge Orchards</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Over 25 years of orchard stewardship producing tree-ripened Honeycrisp apples, summer peaches, and artisanal fresh-pressed cider.
            </p>
          </div>

          <div className="border border-[#E2E8DF] rounded-xl p-5 bg-[#F8FAF6] space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-amber-800 bg-yellow-100 px-2.5 py-0.5 rounded">
                Stall #08 • Logan Square
              </span>
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 5.00 Rating
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Prairie Blossom Apiary</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Organic beekeeping collective harvesting single-source raw wildflower honey with comb slices and pure beeswax candles from local prairie reserves.
            </p>
          </div>
        </div>
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

