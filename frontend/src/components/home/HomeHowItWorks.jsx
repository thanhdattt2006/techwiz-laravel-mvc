import React from 'react';

/**
 * HomeHowItWorks Component
 * 3-step visual workflow explaining the farm pre-order to stall pickup process.
 */
export default function HomeHowItWorks() {
  const steps = [
    {
      number: '1',
      bgClass: 'bg-[#16A34A] shadow-emerald-600/20',
      title: 'Discover Local Markets',
      description:
        'Explore Chicago farmers markets, view operating weekend days, and browse verified stalls with weekly fresh inventory.',
    },
    {
      number: '2',
      bgClass: 'bg-amber-500 shadow-amber-500/20',
      title: 'Pre-Order Ahead',
      description:
        'Choose your harvest items and select a convenient morning pickup window (e.g. 08:00 AM - 10:00 AM) to lock in your order.',
    },
    {
      number: '3',
      bgClass: 'bg-emerald-800 shadow-emerald-800/20',
      title: 'Pick Up at Stall & Pay',
      description:
        "Visit the farmer's stall on market day, inspect your freshly packed produce basket, and settle with cash or card directly.",
    },
  ];

  return (
    <section className="bg-white border-y border-[#E2E8DF] py-16 px-4 sm:px-6 lg:px-8" id="how-it-works">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A]">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            How Pre-Ordering for Stall Pickup Works
          </h2>
          <p className="text-xs sm:text-sm text-[#475569]">
            Guarantee your organic produce before market day arrives. No middleman markups, no online payment hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-6 relative flex flex-col items-center text-center space-y-3 shadow-xs"
            >
              <div
                className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-lg shadow-md ${step.bgClass}`}
              >
                {step.number}
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">{step.title}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
