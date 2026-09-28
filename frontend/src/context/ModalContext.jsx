import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import Modal from '../components/common/Modal';
import { AlertModalContent, ConfirmModalContent } from '../components/common/ModalAlertContent';

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
            <AlertModalContent
              type={type}
              title={title}
              message={message}
              confirmText={confirmText}
              onClose={() => closeModal(true)}
            />
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

        setModalState({
          isOpen: true,
          title: null,
          maxWidth: 'max-w-sm',
          showCloseButton,
          closeOnBackdrop: true,
          closeOnEsc: true,
          content: (
            <ConfirmModalContent
              type={type}
              title={title}
              message={message}
              confirmText={confirmText}
              cancelText={cancelText}
              onConfirm={() => closeModal(true)}
              onCancel={() => closeModal(false)}
            />
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
      render,
      maxWidth = 'max-w-md',
      showCloseButton = true,
      closeOnBackdrop = true,
      closeOnEsc = true,
    }) => {
      clearTimer();
      return new Promise((resolve) => {
        resolverRef.current = resolve;

        const body = content !== undefined ? content : render;
        const renderedContent =
          typeof body === 'function'
            ? body({ close: closeModal, onClose: closeModal })
            : body;

        setModalState({
          isOpen: true,
          title,
          maxWidth,
          showCloseButton,
          closeOnBackdrop,
          closeOnEsc,
          content: renderedContent,
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
