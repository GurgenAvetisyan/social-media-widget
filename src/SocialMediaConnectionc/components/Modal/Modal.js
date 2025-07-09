import React, { useEffect } from "react";

import { CloseIcon } from "../../../assets/icons";

import styles from "./modal.module.css";

const Modal = ({
  isOpen,
  onClose,
  children,
  modalContentClassName = "",
  className = "",
}) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${className}`} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${modalContentClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalClose} onClick={onClose}>
          <CloseIcon />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
