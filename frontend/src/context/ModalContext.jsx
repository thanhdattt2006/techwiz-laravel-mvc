import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import Modal from '../components/common/Modal';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: null,
    maxWidth: 'max-w-md',
    showCloseButton: true,
    closeOnBackdrop: true,
    closeOnEsc: true,
    content: null,
  });

  const resolverRef = useRef(null);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeModal = useCallback((result = false) => {
    clearTimer();
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  const getIconForType = (type) => {
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
  };

  const showAlert = useCallback(
    ({
      title,
      message,
      type = 'info',
      confirmText = 'OK',
      autoCloseMs = null,
      showCloseButton = true,
    }) => {
      clearTimer();
      return new Promise((resolve) => {
        resolverRef.current = resolve;

        if (autoCloseMs) {
          timerRef.current = setTimeout(() => {
            closeModal(true);
          }, autoCloseMs);
        }

        setModalState({
          isOpen: true,
          title: null,
          maxWidth: 'max-w-sm',
          showCloseButton,
          closeOnBackdrop: true,
          closeOnEsc: true,
          content: (
            <div className="text-center py-2 space-y-3">
              {getIconForType(type)}
              {title && (
                <h4 className="text-base font-bold text-[#1F2A37] tracking-tight">{title}</h4>
              )}
              {message && (
                <p className="text-xs text-[#6B7785] leading-relaxed max-w-xs mx-auto">{message}</p>
              )}
              {confirmText !== false && (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => closeModal(true)}
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
          ),
        });
      });
    },
    [closeModal]
  );

  const showConfirm = useCallback(
    ({
      title = 'Are you sure?',
      message,
      type = 'warning',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      showCloseButton = true,
    }) => {
      clearTimer();
      return new Promise((resolve) => {
        resolverRef.current = resolve;

        const isDanger = type === 'danger' || type === 'error';

        setModalState({
          isOpen: true,
          title: null,
          maxWidth: 'max-w-sm',
          showCloseButton,
          closeOnBackdrop: true,
          closeOnEsc: true,
          content: (
            <div className="text-center py-2 space-y-3">
              {getIconForType(type)}
              <h4 className="text-base font-bold text-[#1F2A37] tracking-tight">{title}</h4>
              {message && (
                <p className="text-xs text-[#6B7785] leading-relaxed max-w-xs mx-auto">{message}</p>
              )}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => closeModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1F2A37] text-xs font-bold transition cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => closeModal(true)}
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
          ),
        });
      });
    },
    [closeModal]
  );

  const showCustomModal = useCallback(
    ({
      title = null,
      content,
      maxWidth = 'max-w-md',
      showCloseButton = true,
      closeOnBackdrop = true,
      closeOnEsc = true,
    }) => {
      clearTimer();
      return new Promise((resolve) => {
        resolverRef.current = resolve;

        setModalState({
          isOpen: true,
          title,
          maxWidth,
          showCloseButton,
          closeOnBackdrop,
          closeOnEsc,
          content: typeof content === 'function' ? content({ close: closeModal }) : content,
        });
      });
    },
    [closeModal]
  );

  return (
    <ModalContext.Provider
      value={{
        showAlert,
        showConfirm,
        showCustomModal,
        closeModal,
      }}
    >
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => closeModal(false)}
        title={modalState.title}
        maxWidth={modalState.maxWidth}
        showCloseButton={modalState.showCloseButton}
        closeOnBackdrop={modalState.closeOnBackdrop}
        closeOnEsc={modalState.closeOnEsc}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
