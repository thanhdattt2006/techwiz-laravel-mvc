import React from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

/**
 * MarketScheduleEditor (Phase 4.16)
 * Weekly schedule list and time picker for market venues.
 */
export default function MarketScheduleEditor({ schedules, onChange }) {
  const handleAdd = () => {
    onChange([...schedules, { day_of_week: 6, open_time: '07:00', close_time: '13:00' }]);
  };

  const handleRemove = (index) => {
    onChange(schedules.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    onChange(
      schedules.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="pt-2 border-t border-[#E2E8DF] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
          <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Operating Market Schedules</span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-bold text-[#16A34A] hover:underline cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Add Day</span>
        </button>
      </div>

      {schedules.map((s, idx) => (
        <div key={idx} className="flex items-center gap-2 p-2 bg-[#F8FAF6] rounded-xl border border-[#E2E8DF] text-xs">
          <select
            value={s.day_of_week}
            onChange={(e) => handleFieldChange(idx, 'day_of_week', Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-[#E2E8DF] bg-white font-bold text-xs"
          >
            {DAYS_OF_WEEK.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <span className="text-slate-400 text-xs">From</span>
          <input
            type="time"
            value={s.open_time}
            onChange={(e) => handleFieldChange(idx, 'open_time', e.target.value)}
            className="px-2 py-1 rounded-lg border border-[#E2E8DF] bg-white font-mono text-xs"
          />
          <span className="text-slate-400 text-xs">To</span>
          <input
            type="time"
            value={s.close_time}
            onChange={(e) => handleFieldChange(idx, 'close_time', e.target.value)}
            className="px-2 py-1 rounded-lg border border-[#E2E8DF] bg-white font-mono text-xs"
          />
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="p-1 rounded-md text-red-500 hover:bg-red-50 transition ml-auto cursor-pointer"
            title="Remove schedule"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
