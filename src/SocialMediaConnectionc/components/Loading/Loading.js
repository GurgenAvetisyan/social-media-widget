import React from "react";

import styles from "./loading.module.css";

const Loading = ({ small, className = "" }) => {
  return (
    <div
      className={`${styles.circularProgress} ${
        small ? styles.small : ""
      } ${className}`}
      aria-live="assertive"
      role="status"
    >
      <span className={styles.loader} />
    </div>
  );
};

export default Loading;
