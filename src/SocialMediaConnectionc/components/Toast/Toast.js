import React, { useEffect, useState } from "react";

import { CheckCircleIcon, ReportIcon } from "../../../assets/icons";
import { TOAST_ERROR_TYPE, TOAST_SUCCESS_TYPE } from "./constants";

import styles from "./toast.module.css";

const Toast = ({ message, type, duration, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIconByType = (type) => {
    switch (type) {
      case TOAST_SUCCESS_TYPE:
        return <CheckCircleIcon />;
      case TOAST_ERROR_TYPE:
        return <ReportIcon />;
      default:
        return null;
    }
  };
  const Icon = getIconByType(type);
  return (
    <div className={`${styles.toast} ${show ? styles.show : ""}`}>
      {Icon}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
