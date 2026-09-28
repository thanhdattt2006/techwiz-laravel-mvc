import React from 'react';
import { Award, Star } from 'lucide-react';

/**
 * HomeCommunitySpotlight Component
 * Grower of the week spotlight card and verified customer testimonials.
 */
export default function HomeCommunitySpotlight() {
  const reviews = [
    {
      author: 'Sarah Jenkins (Lincoln Park)',
      comment:
        '"I never miss out on heirloom tomatoes anymore! Reserving on Thursday evening means my basket is already packed when I walk over Saturday morning."',
    },
    {
      author: 'David Chen (Logan Square)',
      comment:
        '"Direct connection with local beekeepers and bakers is amazing. The raw wildflower honey and sourdough are fresher than anything you can buy in a grocery store."',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Spotlight Story */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-900 to-[#15803D] text-white p-8 rounded-3xl shadow-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Grower Spotlight of the Week</span>
          </div>
          <h3 className="text-2xl font-black leading-snug">
            "MarketLink lets us pick only what's needed at peak ripeness."
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Meet Thomas Miller, 3rd-generation grower at Green Valley Organics. By receiving pre-orders on MarketLink prior to Saturday morning, his family farm reduced post-market spoilage by 95% while customers get produce harvested just hours before pickup.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-sm">
              TM
            </div>
            <div>
              <div className="text-xs font-bold text-white">Thomas Miller</div>
              <div className="text-[11px] text-emerald-200">Green Valley Organics • Lincoln Park Market</div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="lg:col-span-6 space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.author}
              className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">{rev.author}</span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
