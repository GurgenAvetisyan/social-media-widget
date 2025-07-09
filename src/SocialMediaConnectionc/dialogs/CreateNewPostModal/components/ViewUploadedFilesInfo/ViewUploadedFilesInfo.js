import React from "react";

import { FileIcon, TrashSmallIcon } from "../../../../../assets/icons";
import { formatBytes } from "../../../../helpers";

const ViewUploadedFilesInfo = ({ files, handleRemoveFile, styles }) => {
  if (!files.length) return;

  return (
    <div className={styles.viewUploadedFileswrap}>
      {files.map((file) => {
        const { file: { name, size } = {}, id } = file;
        return (
          <div className={styles.viewUploadedFileInfo} key={id}>
            <div className={styles.leftBox}>
              <div className={styles.fileIcon}>
                <FileIcon />
              </div>
              <div className={styles.fileInfoWrap}>
                <div className={styles.fileName}>{name}</div>
                <div className={styles.fileSize}>{formatBytes(size)}</div>
              </div>
            </div>
            <div
              className={styles.trashIcon}
              onClick={() => handleRemoveFile(id)}
            >
              <TrashSmallIcon />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewUploadedFilesInfo;
