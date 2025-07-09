import React, { createContext, useContext, useState, useCallback } from "react";
import { uniqueId } from "../../helpers";
import { TOAST_SUCCESS_TYPE } from "./constants";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (message, type = TOAST_SUCCESS_TYPE, duration = 3000) => {
      const newToast = { message, type, id: uniqueId(), duration };
      setToasts((prevToasts) => [...prevToasts, newToast]);

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== newToast.id)
        );
      }, duration);
    },
    []
  );

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
