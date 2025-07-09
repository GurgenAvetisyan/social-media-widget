import React, { useEffect, useState } from "react";
import {
  SOCIAL_PROVIDER_KEY_FACEBOOK,
  SOCIAL_PROVIDER_KEY_INSTAGRAM,
} from "../../config";

import Modal from "../../components/Modal";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import {
  getSocialProviderPagesURL,
  updateSocialPageConnectionStatusURL,
} from "../../apis";
import { useApiClient } from "../../../useApiClient";
import Loading from "../../components/Loading";
import { wrongMessage } from "../../constants";
import { TOAST_ERROR_TYPE } from "../../components/Toast/constants";
import { useToast } from "../../components/Toast/ToastContext";
import { handlePageImageError } from "../../helpers";
import userIcon from "../../../assets/icons/userIcon.svg";

import styles from "./socialMediaPagesModal.module.css";

const facebookAccountsEmptyText =
  "There are no Pages associated to your Facebook account. You need to have a Page to establish a connection and make posts.";

const instagramAccountsEmptyText =
  "There are no Instagram business pages associated to your Facebook account. You need to have a business page to establish a connection and make posts.";

const SocialMediaPagesModal = ({
  onClose,
  isInstagramModal,
  setSocialProviders,
  setSelectedAccounts,
}) => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedButtonIndex, setClickedButtonIndex] = useState(-1);
  const currentSocialProvider = isInstagramModal ? "instagram" : "facebook";
  const currentSocialProviderKey = isInstagramModal
    ? SOCIAL_PROVIDER_KEY_INSTAGRAM
    : SOCIAL_PROVIDER_KEY_FACEBOOK;
  const capitalizedSocialProvider =
    currentSocialProvider.charAt(0).toUpperCase() +
    currentSocialProvider.slice(1);

  const apiClient = useApiClient();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSocialProviderPages = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(getSocialProviderPagesURL());
        const pages = response?.data?.[currentSocialProvider];
        setPages(pages || []);
      } catch (error) {
        addToast(wrongMessage, TOAST_ERROR_TYPE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialProviderPages();
  }, [currentSocialProvider, currentSocialProviderKey, apiClient, addToast]);

  const handleConnectionStatusChange = async (pageId, status) => {
    try {
      setClickedButtonIndex(pageId);
      await apiClient.patch(
        updateSocialPageConnectionStatusURL({
          socialProviderKey: currentSocialProviderKey,
          pageId,
        }),
        { status }
      );
      if (status === 0) {
        setSelectedAccounts((prevState) =>
          prevState.filter(({ id }) => id !== pageId)
        );
      }
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.id === pageId ? { ...page, status } : page
        )
      );

      setSocialProviders((prevState) => [...prevState]);
    } catch (e) {
      addToast(wrongMessage, TOAST_ERROR_TYPE);
    } finally {
      setClickedButtonIndex(-1);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      modalContentClassName={styles.facebookManagePagesModalContent}
    >
      <div className={styles.modalTitle}>
        Manage {capitalizedSocialProvider} pages
      </div>
      <div className={styles.modalDescriptions}>
        Choose {capitalizedSocialProvider} pages that you would like to connect.
      </div>
      {isLoading ? (
        <Loading />
      ) : pages?.length === 0 ? (
        <div className={styles.emptyPages}>
          {isInstagramModal
            ? instagramAccountsEmptyText
            : facebookAccountsEmptyText}
        </div>
      ) : (
        <div className={styles.pagesListBlock}>
          {pages.map((page, index) => {
            const { id, status, imageUrl, name } = page;
            const isConnected = status === 1;

            const isDisabledConnectandDisconnectBtn =
              clickedButtonIndex > 0
                ? clickedButtonIndex !== id
                  ? true
                  : false
                : "";

            return (
              <div className={styles.pagesListItem} key={index}>
                <div className={styles.pageInfoWrap}>
                  <img
                    src={imageUrl || userIcon}
                    alt={name}
                    className={styles.pageImage}
                    onError={(e) => {
                      handlePageImageError(e, userIcon);
                    }}
                  />
                  <h6 className={styles.pageName}>{name}</h6>
                </div>
                <div className={styles.pageActionButtons}>
                  <SecondaryButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectionStatusChange(id, isConnected ? 0 : 1);
                    }}
                    color={isConnected ? "secondary" : "primary"}
                    disabled={isDisabledConnectandDisconnectBtn}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </SecondaryButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
};

export default SocialMediaPagesModal;
