import React, { memo } from "react";

import {
  TrashSmallIcon,
  UserIcon,
  WarningCircleIcon,
} from "../../../../../assets/icons";
import { MEDIA_ATTACHMENT_AND_CONTENT_CONDITIONS } from "../../constants";
import { handlePageImageError } from "../../../../helpers";
import userIcon from "../../../../../assets/icons/userIcon.svg";

const SelectedAccounts = ({
  selectedAccounts,
  removeAccount,
  formData,
  selectedAccountForCustomize,
  // setSelectedAccountForCustomize,
  styles,
}) => {
  // const selectAccount = (account) => {
  //   setSelectedAccountForCustomize(account);
  // };

  const getProviderConditions = (key) => {
    return (
      MEDIA_ATTACHMENT_AND_CONTENT_CONDITIONS.find(
        ({ providerKey }) => providerKey === key
      ) || {}
    );
  };

  return (
    <div className={styles.selectedAccountsWrap}>
      {selectedAccounts.map((account) => {
        const { imageUrl, id, icon, name, key } = account;
        const conditions = getProviderConditions(key);
        const content = formData.content;
        const isErrorForCharacterLimit =
          content.length > conditions.contentCharacterCount;
        return (
          <div
            key={id}
            className={`${styles.selectedAccountItem} ${
              selectedAccountForCustomize?.id === id ? styles.active : ""
            }`}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   selectAccount(account);
            // }}
          >
            <span
              className={styles.removeIcon}
              onClick={(e) => {
                e.stopPropagation();
                removeAccount(id);
              }}
            >
              <TrashSmallIcon />
            </span>
            <span className={styles.accountIcon}>{icon}</span>
            {imageUrl ? (
              <img
                src={imageUrl || userIcon}
                alt={name}
                onError={(e) => {
                  handlePageImageError(e, userIcon);
                }}
              />
            ) : (
              <span className={styles.userIcon}>
                <UserIcon />
              </span>
            )}
            {isErrorForCharacterLimit ? (
              <span className={styles.warningIcon}>
                <WarningCircleIcon />
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default memo(SelectedAccounts);
