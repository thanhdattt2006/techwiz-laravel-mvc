import React from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

/**
 * StatusBadge Component
 * Displays standardized botanical and semantic badges for Pre-Orders, Stall Applications, and Moderation.
 *
 * @param {string} status - Status key or label
 * @param {'sm'|'md'} size - Badge size
 */
export default function StatusBadge({ status = 'Placed', size = 'sm', className = '' }) {
  const normalized = (status || '').toLowerCase().trim();

  // Status mapping logic
  let config = {
    label: status,
    bg: 'bg-slate-100 text-[#475569] border-slate-200',
    icon: Clock,
    pulse: false,
  };

  if (
    normalized.includes('ready') ||
    normalized === 'ready for pickup' ||
    normalized === 'active' ||
    normalized === 'approved'
  ) {
    config = {
      label: status === 'ready' ? 'Ready for Pickup' : status,
      bg: 'bg-emerald-100 text-[#16A34A] border-emerald-200',
      icon: CheckCircle2,
      pulse: true,
    };
  } else if (
    normalized.includes('harvest') ||
    normalized.includes('packed') ||
    normalized.includes('confirmed') ||
    normalized.includes('preparing')
  ) {
    config = {
      label: status,
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Package,
      pulse: false,
    };
  } else if (
    normalized.includes('placed') ||
    normalized.includes('reserved') ||
    normalized.includes('pending')
  ) {
    config = {
      label: status,
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: ShoppingBag,
      pulse: false,
    };
  } else if (
    normalized.includes('completed') ||
    normalized.includes('settled') ||
    normalized.includes('picked up')
  ) {
    config = {
      label: status,
      bg: 'bg-slate-100 text-[#475569] border-slate-200',
      icon: CheckCircle2,
      pulse: false,
    };
  } else if (
    normalized.includes('cancel') ||
    normalized.includes('reject') ||
    normalized.includes('failed')
  ) {
    config = {
      label: status,
      bg: 'bg-rose-100 text-rose-700 border-rose-200',
      icon: XCircle,
      pulse: false,
    };
  } else if (normalized.includes('featured')) {
    config = {
      label: status,
      bg: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: Sparkles,
      pulse: false,
    };
  }

  const IconComponent = config.icon;
  const paddingClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const iconSizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border transition ${config.bg} ${paddingClass} ${className}`}
    >
      {config.pulse && (
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
      )}
      <IconComponent className={`${iconSizeClass} shrink-0`} />
      <span className="truncate">{config.label}</span>
    </span>
  );
}
