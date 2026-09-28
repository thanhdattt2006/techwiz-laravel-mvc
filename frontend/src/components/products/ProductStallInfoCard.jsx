import React from 'react';
import { MapPin, Store, Phone, Award } from 'lucide-react';

/**
 * ProductStallInfoCard
 * Displays grower details, farm origin, and registered weekend market stalls.
 */
export default function ProductStallInfoCard({ farmer }) {
  if (!farmer) {
    return null;
  }

  const markets = Array.isArray(farmer.markets) ? farmer.markets : [];
  const coverImage = farmer.cover_image || farmer.stall_image || '/default-stall-cover.png';

  return (
    <div className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl overflow-hidden shadow-xs">
      {/* Stall Cover Banner */}
      <div className="h-28 w-full relative overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={farmer.stall_name || 'Stall Cover'}
          onError={(e) => { e.currentTarget.src = '/default-stall-cover.png'; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-white">
          <span className="text-xs font-black tracking-tight drop-shadow-xs truncate mr-2">
            {farmer.stall_name}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold shrink-0 shadow-xs">
            <Award className="w-3 h-3" />
            Verified Stall
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Stall Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={farmer.avatar || farmer.logo || '/default-avatar.svg'}
              alt={farmer.stall_name}
              onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
              className="w-10 h-10 rounded-xl object-cover bg-emerald-50 border border-emerald-100 p-0.5 shrink-0"
            />
            <div>
              <h3 className="text-sm font-black text-[#0F172A] tracking-tight">
                {farmer.stall_name}
              </h3>
              <p className="text-xs text-[#475569]">
                {farmer.contact_person ? `Master Grower: ${farmer.contact_person}` : 'Local Farm Partner'}
              </p>
            </div>
          </div>

          {farmer.avg_rating > 0 && (
            <div className="text-right">
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                ★ {Number(farmer.avg_rating).toFixed(1)}
              </span>
              <span className="block text-[10px] text-[#475569] mt-0.5">
                ({farmer.review_count || 0} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Origin & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#475569]">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
              Farmstead Address:
            </span>
            <p className="text-[#0F172A] font-medium leading-relaxed">
              {farmer.address || 'Regional Organic Farmland'}
            </p>
          </div>

          {farmer.contact_phone && (
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                Stall Direct Contact:
              </span>
              <p className="text-[#0F172A] font-medium">{farmer.contact_phone}</p>
            </div>
          )}
        </div>

        {/* Weekend Market Stalls */}
        {markets.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-amber-500" />
              Active Farmers Market Stalls:
            </span>
            <div className="space-y-2">
              {markets.map((mkt) => (
                <div
                  key={mkt.id}
                  className="p-2.5 rounded-xl bg-white border border-[#E2E8DF] flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <strong className="text-[#0F172A] block">{mkt.name}</strong>
                    <span className="text-[11px] text-[#475569]">{mkt.address}</span>
                  </div>
                  {mkt.stall_location && (
                    <span className="font-mono text-[11px] font-bold bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                      {mkt.stall_location}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
