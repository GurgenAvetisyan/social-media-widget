import React from "react";

import styles from "./secondaryButton.module.css";

const SecondaryButton = ({
  onClick,
  children,
  color = "primary",
  className = "",
  disabled = false,
}) => {
  const colorClassName =
    color === "primary" ? styles.primary : styles.secondary;
  return (
    <button
      className={`${styles.secondaryButton} ${colorClassName} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
