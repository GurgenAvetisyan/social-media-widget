import React, { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import CreateNewPostModal from "../../dialogs/CreateNewPostModal";

import styles from "./createPostButton.module.css";

const CreatePostButton = ({
  twitterAndLinkedProviders,
  selectedAccounts,
  setSelectedAccounts,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const openCreatePostModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className={styles.createPostButtonWrap}>
        <div>Social Media Posts</div>
        <PrimaryButton onClick={openCreatePostModal}>Create Post</PrimaryButton>
      </div>
      <CreateNewPostModal
        isOpen={isOpen}
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
        handleClose={handleCloseModal}
        twitterAndLinkedProviders={twitterAndLinkedProviders}
      />
    </>
  );
};

export default CreatePostButton;
