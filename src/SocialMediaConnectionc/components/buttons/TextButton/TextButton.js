import React from "react";

import styles from "./textButton.module.css";

const TextButton = ({
  onClick,
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={` ${className} ${styles.textButton}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TextButton;
