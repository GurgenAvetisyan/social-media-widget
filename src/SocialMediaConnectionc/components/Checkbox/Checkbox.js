import React from "react";

import styles from "./checkbox.module.css";

const Checkbox = ({ onChange, isChecked, label = "" }) => {
  return (
    <label className={styles.checkboxContainer}>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {label}
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;
