import React from "react";

import { AttachmentLineIcon } from "../../../../../assets/icons";

const MediaAttachment = ({ handleFileChange, styles, isDisabled }) => {
  const disabledClass = isDisabled ? styles.disabled : "";

  return (
    <div className={styles.mediaAttachmentWrap}>
      <input
        type="file"
        multiple
        accept="image/png, image/jpg, image/jpeg"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="widgetMediaUpload"
      />
      <label
        htmlFor="widgetMediaUpload"
        className={`${styles.uploadButton} ${disabledClass} `}
      >
        <AttachmentLineIcon />
        Attach Media
      </label>
    </div>
  );
};

export default MediaAttachment;
