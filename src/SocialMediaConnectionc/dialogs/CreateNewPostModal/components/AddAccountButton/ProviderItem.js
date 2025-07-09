import React from "react";

import TextButton from "../../../../components/buttons/TextButton";
import { handlePageImageError, uniqueId } from "../../../../helpers";
import userIcon from "../../../../../assets/icons/userIcon.svg";

const ProviderItem = ({ provider, className = "", addAccount, styles }) => {
  const { pages, name, icon, key, imageUrl } = provider;

  return (
    <div className={`${styles.dropdownItem} ${className}`}>
      <div className={styles.providerInfoBox}>
        {icon}
        {name}
      </div>
      {pages ? (
        pages.map((page) => {
          const { imageUrl, name, id } = page;
          return (
            <div className={styles.pageItem} key={id}>
              <div className={styles.leftBox}>
                <img
                  src={imageUrl || userIcon}
                  alt={name}
                  onError={(e) => {
                    handlePageImageError(e, userIcon);
                  }}
                />
                <div className={styles.pageName}>{name}</div>
              </div>
              <TextButton
                onClick={(e) => {
                  e.stopPropagation();
                  addAccount({ id, key, name, imageUrl, icon });
                }}
              >
                Add
              </TextButton>
            </div>
          );
        })
      ) : (
        <TextButton
          onClick={(e) => {
            e.stopPropagation();
            addAccount({ id: uniqueId(), key, name, imageUrl, icon });
          }}
        >
          Add
        </TextButton>
      )}
    </div>
  );
};

export default ProviderItem;
