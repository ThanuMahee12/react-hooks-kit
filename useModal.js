import { useState, useCallback } from 'react';

/**
 * Manage open/close state for a modal (or any dismissible overlay),
 * with optional payload data attached while open.
 *
 * @param {boolean} [initialState=false] Whether the modal starts open.
 * @returns {Object} Modal state and handlers.
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const open = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data so exit animations can still read it.
    setTimeout(() => setModalData(null), 150);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    open,
    close,
    toggle,
    setModalData,
  };
};

export default useModal;
