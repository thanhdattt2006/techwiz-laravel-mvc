import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

export function getModalIcon(type) {
  switch (type) {
    case 'success':
      return (
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#198754] flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      );
    case 'danger':
    case 'error':
      return (
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#DC3545] flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
      );
    case 'warning':
      return (
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
      );
    case 'info':
    default:
      return (
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0B6EFD] flex items-center justify-center mx-auto mb-3">
          <Info className="w-6 h-6" />
        </div>
      );
  }
}

export function AlertModalContent({ type, title, message, confirmText, onClose }) {
  return (
    <div className="text-center py-2 space-y-3">
      {getModalIcon(type)}
      {title && <h4 className="text-base font-bold text-[#1F2A37] tracking-tight">{title}</h4>}
      {message && <p className="text-xs text-[#6B7785] leading-relaxed max-w-xs mx-auto">{message}</p>}
      {confirmText !== false && (
        <div className="pt-3">
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              type === 'danger' || type === 'error'
                ? 'bg-[#DC3545] hover:bg-red-700 text-white'
                : 'bg-[#0B6EFD] hover:bg-[#084298] text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      )}
    </div>
  );
}

export function ConfirmModalContent({ type, title, message, confirmText, cancelText, onConfirm, onCancel }) {
  const isDanger = type === 'danger' || type === 'error';
  return (
    <div className="text-center py-2 space-y-3">
      {getModalIcon(type)}
      <h4 className="text-base font-bold text-[#1F2A37] tracking-tight">{title}</h4>
      {message && <p className="text-xs text-[#6B7785] leading-relaxed max-w-xs mx-auto">{message}</p>}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1F2A37] text-xs font-bold transition cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
            isDanger
              ? 'bg-[#DC3545] hover:bg-red-700 text-white shadow-red-500/20'
              : 'bg-[#0B6EFD] hover:bg-[#084298] text-white shadow-blue-500/20'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
