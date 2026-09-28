import React from 'react';
import { ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';

/**
 * TrackerStepper
 * Renders the 4-Step Pre-Order Fulfillment Lifecycle according to the Order State Machine:
 * 1. Placed -> 2. Accepted -> 3. Ready for Pickup -> 4. Completed
 */
export default function TrackerStepper({
  steps,
  isCancelled,
  isDeclined,
  secondsRemaining,
  formattedTimer,
  status,
}) {
  return (
    <section className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
            <span>4-Step Pre-Order Fulfillment Lifecycle</span>
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Track your reserved produce from regional field harvest to stall pickup basket
          </p>
        </div>

        {!isCancelled && !isDeclined && status !== 'completed' && secondsRemaining > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
            <Clock className="w-4 h-4 text-[#16A34A] animate-pulse" />
            <div className="text-xs">
              <span className="text-[#475569]">
                {status === 'ready_for_pickup' ? 'Stall Window Closes In: ' : 'Order Cutoff In: '}
              </span>
              <strong className="text-[#15803D] font-mono">{formattedTimer}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Graphic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((s) => (
          <div
            key={s.step}
            className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
              s.isCurrent
                ? 'border-[#16A34A] bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                : s.isPassed
                ? 'border-emerald-200 bg-white'
                : 'border-[#E2E8DF] bg-[#F8FAF6]/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                  s.isPassed
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-slate-200 text-[#475569]'
                }`}
              >
                {s.isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </span>
              <span className="text-[10px] font-mono text-[#475569]">{s.time}</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] leading-snug">{s.title}</h4>
              <p className="text-[11px] text-[#475569] mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
