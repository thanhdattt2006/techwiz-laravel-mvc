import React from 'react';
import { Search } from 'lucide-react';
import { DAYS_OF_WEEK } from '../../hooks/useMarkets';

/**
 * MarketFilterBar Component
 * Search input and day-of-the-week pills for the Farmers Markets directory.
 */
export default function MarketFilterBar({
  searchTerm,
  onSearchChange,
  selectedDay,
  onDaySelect,
}) {
  return (
    <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Keyword Search */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by market name, address (Lincoln Park, Logan Square), or produce..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAF6] border border-[#E2E8DF] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#16A34A]"
        />
      </div>

      {/* Day Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto shrink-0 pb-1 md:pb-0">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day.label}
            type="button"
            onClick={() => onDaySelect(day.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedDay === day.value
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>
    </div>
  );
}
