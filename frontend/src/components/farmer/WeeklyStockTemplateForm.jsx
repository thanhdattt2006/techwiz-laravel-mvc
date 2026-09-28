import React from 'react';
import { Calendar, Save, Loader2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * WeeklyStockTemplateForm (Phase 4.13)
 * Configures the recurring 7-day quota template for a specific produce item.
 */
export default function WeeklyStockTemplateForm({
  templates = [],
  onUpdateDay,
  onSave,
  saving = false,
  productName = '',
  unit = 'kg',
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A]">
            7-Day Recurring Quotas for: <span className="text-[#16A34A]">{productName}</span>
          </h3>
          <p className="text-xs text-[#475569]">
            Set target default harvest volume brought to each market session day.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Template...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save 7-Day Template</span>
            </>
          )}
        </button>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {templates.map((day) => {
          const isWeekend = day.day_of_week === 0 || day.day_of_week === 6;

          return (
            <div
              key={day.day_of_week}
              className={`p-4 rounded-2xl border transition space-y-3 ${
                day.is_active
                  ? 'bg-white border-emerald-200 shadow-2xs'
                  : 'bg-[#F8FAF6] border-[#E2E8DF] opacity-75'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className={`w-4 h-4 ${isWeekend ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-[#0F172A]">{day.day_name}</span>
                </div>
                {isWeekend && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-[#16A34A] px-1.5 py-0.5 rounded-sm">
                    Market Day
                  </span>
                )}
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(day.is_active)}
                  onChange={(e) => onUpdateDay(day.day_of_week, 'is_active', e.target.checked)}
                  className="rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-[#475569]">
                  {day.is_active ? 'Harvest session active' : 'Stall closed / No harvest'}
                </span>
              </label>

              {/* Default Quantity Input */}
              <div className="space-y-1">
                <label
                  htmlFor={`qty-${day.day_of_week}`}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"
                >
                  Quota ({unit})
                </label>
                <div className="relative">
                  <input
                    id={`qty-${day.day_of_week}`}
                    type="number"
                    step="0.5"
                    min="0"
                    disabled={!day.is_active}
                    value={day.default_quantity}
                    onChange={(e) =>
                      onUpdateDay(day.day_of_week, 'default_quantity', parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-3 pr-10 py-1.5 rounded-xl border border-[#E2E8DF] bg-white text-xs font-mono font-bold focus:ring-2 focus:ring-[#16A34A] focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase">
                    {unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
