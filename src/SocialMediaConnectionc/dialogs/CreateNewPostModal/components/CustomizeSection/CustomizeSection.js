import React from "react";

import { VisibilityIcon, VisibilityOffIcon } from "../../../../../assets/icons";
import Checkbox from "../../../../components/Checkbox";

import styles from "./customizeSection.module.css";

const CustomizeSection = ({
  handlePreviewPost,
  isShowPreview,
  setIsCustomize,
  isCustomize,
}) => {
  const handleCheckboxChange = (event) => {
    setIsCustomize(event.target.checked);
  };

  return (
    <div className={styles.customizeSection}>
      <Checkbox
        onChange={handleCheckboxChange}
        isChecked={isCustomize}
        label="Customize for each account"
      />
      <div className={styles.visibilityIcon} onClick={handlePreviewPost}>
        {isShowPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </div>
    </div>
  );
};

export default CustomizeSection;
