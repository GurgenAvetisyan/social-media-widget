import React from "react";

import styles from "./tooltip.module.css";

const Tooltip = ({ children, isShow, title }) => {
  return isShow ? (
    <div className={styles.tooltip}>
      <span className={styles.tooltipText}>{title}</span>
      {children}
    </div>
  ) : (
    children
  );
};

export default Tooltip;
