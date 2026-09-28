import React from 'react';
import { Loader2, Sprout } from 'lucide-react';

export default function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8 text-center animate-in fade-in duration-300">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shadow-xs">
        <Sprout className="w-6 h-6 animate-pulse" />
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
        <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
        <span>Loading MarketLink...</span>
      </div>
    </div>
  );
}
