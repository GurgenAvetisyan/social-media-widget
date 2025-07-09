import React, { useState } from "react";

import Modal from "../../components/Modal";
import { TrashIcon } from "../../../assets/icons";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import { disconnectSocialProviderURL } from "../../apis";
import { useApiClient } from "../../../useApiClient";
import { useToast } from "../../components/Toast/ToastContext";
import { wrongMessage } from "../../constants";
import {
  TOAST_ERROR_TYPE,
  TOAST_SUCCESS_TYPE,
} from "../../components/Toast/constants";

import styles from "./disconnectDialog.module.css";

const DisconnectDialog = ({
  isOpen,
  onClose,
  name,
  providerKey,
  setSocialProviders,
  setSelectedAccounts,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const apiClient = useApiClient();
  const { addToast } = useToast();

  const handleDisconnect = async () => {
    if (!providerKey) return;
    setIsLoading(true);
    try {
      await apiClient.patch(disconnectSocialProviderURL(), {
        type: providerKey,
      });
      setSelectedAccounts((prevState) =>
        prevState.filter(({ key }) => key !== providerKey)
      );
      setSocialProviders((prevState) =>
        prevState.map((provider) => {
          if (provider.key === providerKey) {
            return { ...provider, connected: false };
          }
          return provider;
        })
      );
      const successfullyMessage = `${name} account successfully disconnected.`;
      addToast(successfullyMessage, TOAST_SUCCESS_TYPE);
      onClose();
    } catch (error) {
      addToast(wrongMessage, TOAST_ERROR_TYPE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalContentClassName={styles.disconnectDialogModalContent}
    >
      <div className={styles.trashIcon}>
        <TrashIcon />
      </div>
      <div className={styles.modalTitle}>Disconnect {name}</div>

      <div className={styles.modalDescription}>
        Do you want to unlink your {name} account?
      </div>

      <div className={styles.modalActionsWrap}>
        <SecondaryButton color="secondary" onClick={onClose}>
          Cancel
        </SecondaryButton>

        <PrimaryButton
          onClick={handleDisconnect}
          disabled={isLoading}
          isLoading={isLoading}
          className={styles.disconnectBtn}
        >
          Disconnect
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default DisconnectDialog;
