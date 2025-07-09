import React from "react";

import Loading from "../../Loading";

import styles from "./primaryButton.module.css";

const PrimaryButton = ({
  onClick,
  children,
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  return (
    <button
      className={`${styles.primaryButton} ${className} ${
        isLoading ? styles.loading : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <Loading small className={styles.loaderPrimaryBtn} />
      ) : null}
      {children}
    </button>
  );
};

export default PrimaryButton;
