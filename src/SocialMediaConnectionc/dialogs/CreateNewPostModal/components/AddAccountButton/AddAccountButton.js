import React, { useState, useRef, useEffect } from "react";

import { PlusIcon } from "../../../../../assets/icons";
import { uniqueId } from "../../../../helpers";
import ProviderItem from "./ProviderItem";
import Tooltip from "../../../../components/Tooltip";
import Loading from "../../../../components/Loading";

import styles from "./addAccountButton.module.css";

const emptyAccountText = "You do not have any accounts to add.";

const AddAccountButton = ({
  addAccount,
  isLoading,
  selectedAccounts,
  showButtonText,
  facebookAndInstagramProviders,
  twitterAndLinkedProviders,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const availableTwitterAndLinkedProviders = twitterAndLinkedProviders.filter(
    ({ key }) => !selectedAccounts.some((account) => account.key === key)
  );

  const availableFacebookAndInstagramProviders = facebookAndInstagramProviders
    .map((provider) => {
      const { name, icon, pages, key } = provider;
      return {
        name,
        icon,
        key,
        pages: pages.filter(
          ({ id }) => !selectedAccounts.some((account) => account.id === id)
        ),
      };
    })
    .filter((provider) => provider.pages.length > 0);

  const isDisabled =
    availableTwitterAndLinkedProviders.length ||
    availableFacebookAndInstagramProviders.length ||
    isLoading;

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <Tooltip title={emptyAccountText} isShow={!isDisabled}>
        <div
          className={`${styles.addAccountButton} ${
            !isDisabled ? styles.disabled : ""
          }`}
          onClick={toggleMenu}
        >
          <PlusIcon />
          {!showButtonText ? "Add Account" : null}
        </div>
      </Tooltip>

      <div
        className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}
        style={{ left: !showButtonText ? "150px" : "60px" }}
      >
        <div className={styles.dropdownTitle}>Add account</div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={styles.providerWrap}>
            {availableTwitterAndLinkedProviders.length ||
            availableFacebookAndInstagramProviders.length ? (
              <>
                {availableFacebookAndInstagramProviders.map((provider) => {
                  return (
                    <ProviderItem
                      provider={provider}
                      key={uniqueId()}
                      addAccount={addAccount}
                      styles={styles}
                    />
                  );
                })}
                {availableTwitterAndLinkedProviders.map((provider) => {
                  return (
                    <ProviderItem
                      provider={provider}
                      key={uniqueId()}
                      addAccount={addAccount}
                      className={styles.noPageProvider}
                      styles={styles}
                    />
                  );
                })}
              </>
            ) : (
              <div className={styles.emptyAccountText}>{emptyAccountText}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAccountButton;
