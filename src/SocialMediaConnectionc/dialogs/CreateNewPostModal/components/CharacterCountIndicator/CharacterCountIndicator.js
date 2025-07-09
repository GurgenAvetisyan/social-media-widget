import React from "react";

import styles from "../../createNewPostModal.module.css";

const CharacterCountIndicator = ({
  contentCharacterCount,
  minContentCharacterCount,
  isAboveMin,
}) => {
  return (
    <div
      className={`${styles.characterCount} ${
        isAboveMin ? styles.isAboveMin : ""
      }`}
    >
      <span>{contentCharacterCount}</span>/
      <span className={styles.minContentCharacterCount}>
        {minContentCharacterCount}
      </span>
    </div>
  );
};

export default CharacterCountIndicator;
