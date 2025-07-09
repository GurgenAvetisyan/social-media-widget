import React from "react";

import Modal from "../../components/Modal";
import SecondaryButton from "../../components/buttons/SecondaryButton";

import styles from "./twitterOverloadedDialog.module.css";

const TwitterOverloadedDialog = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalContentClassName={styles.twitterOverloadedModalContent}
    >
      <div className={styles.modalTitle}>We're sorry!</div>
      <div className={styles.modalDescription}>
        Looks like Twitter's server is overloaded. Please try again later․
      </div>
      <div>
        <SecondaryButton onClick={onClose}>OK</SecondaryButton>
      </div>
    </Modal>
  );
};

export default TwitterOverloadedDialog;
