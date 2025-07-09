import React, { useCallback, useEffect, useState } from "react";

import Modal from "../../components/Modal";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import {
  FacebookIcon,
  InfoIcon,
  InstagramIcon,
  WarningIcon,
} from "../../../assets/icons";
import TextareaInput from "./components/TextareaInput";
import MediaAttachment from "./components/MediaAttachment";
import ViewUploadedFilesInfo from "./components/ViewUploadedFilesInfo";
import AddAccountButton from "./components/AddAccountButton";

// to do
// import PreviewSection from "./components/PreviewSection";
// import CustomizeSection from "./components/CustomizeSection";

import SelectedAccounts from "./components/SelectedAccounts";
import {
  createPostURL,
  getSocialProviderPagesURL,
  uploadImageURL,
} from "../../apis";
import {
  SOCIAL_PROVIDER_KEY_FACEBOOK,
  SOCIAL_PROVIDER_KEY_INSTAGRAM,
  SOCIAL_PROVIDER_KEY_LINKEDIN,
  SOCIAL_PROVIDER_KEY_TWITTER,
  TWITTER_CHANNEL_VALUE,
  FACEBOOK_CHANNEL_VALUE,
  INSTAGRAM_CHANNEL_VALUE,
  LINKEDIN_CHANNEL_VALUE,
} from "../../config";
import { TOTAL_MEDIA_COUNT } from "./constants";
import CharacterCountIndicator from "./components/CharacterCountIndicator";

import {
  getMinContentCharacterCountByProviderKeys,
  getRecommendedAspectRatios,
  validateFiles,
} from "./helpers";
import { handleCompressedFiles } from "../../helpers";
import Tooltip from "../../components/Tooltip";
import { useApiClient } from "../../../useApiClient";
import { useToast } from "../../components/Toast/ToastContext";
import {
  createdPostSuccessfullyMessage,
  attachMediaIsRequiredMessage,
  createdPostFailedMessage,
  filesLimitErrorMessage,
  wrongMessage,
  filesFormatErrorMessage,
  filesSizeErrorMessage,
  tooltipTitleForRecommendedImageAspectRatio,
} from "../../constants";
import {
  TOAST_ERROR_TYPE,
  TOAST_SUCCESS_TYPE,
} from "../../components/Toast/constants";

import styles from "./createNewPostModal.module.css";
import { useAuth } from "../../../AuthContext";

const providerConfig = {
  facebook: {
    icon: <FacebookIcon />,
    key: SOCIAL_PROVIDER_KEY_FACEBOOK,
  },
  instagram: {
    icon: <InstagramIcon />,
    key: SOCIAL_PROVIDER_KEY_INSTAGRAM,
  },
};

const initialFormFata = { files: [], content: "" };

const CreateNewPostModal = ({
  isOpen,
  handleClose,
  selectedAccounts,
  setSelectedAccounts,
  twitterAndLinkedProviders,
}) => {
  const [formData, setFormData] = useState(initialFormFata);
  const [isLoading, setIsLoading] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [selectedAccountForCustomize, setSelectedAccountForCustomize] =
    useState(null);
  // const [isDragActive, setIsDragActive] = useState(false);
  // const [isCustomize, setIsCustomize] = useState(false);
  // const [isShowPreview, setIsShowPreview] = useState(false);
  const [facebookAndInstagramProviders, setFacebookAndInstagramProviders] =
    useState([]);

  const { refreshTable } = useAuth();

  const { addToast } = useToast();

  const apiClient = useApiClient();

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient(getSocialProviderPagesURL());

      const providers = ["facebook", "instagram"].reduce((acc, key) => {
        const pages = data[key];

        if (pages?.length) {
          acc.push({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            icon: providerConfig[key]?.icon,
            key: providerConfig[key]?.key,
            pages: pages.filter(({ status }) => Boolean(status)),
          });
        }

        return acc;
      }, []);

      setFacebookAndInstagramProviders(providers);
    } catch (error) {
      addToast(wrongMessage, TOAST_ERROR_TYPE);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, addToast]);

  const resetForm = useCallback(() => {
    setFormData(initialFormFata);
    setFacebookAndInstagramProviders([]);
    // setIsCustomize(false);
    // setIsShowPreview(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
    }
    return () => {
      if (!isOpen) {
        resetForm();
      }
    };
  }, [isOpen, fetchProviders, resetForm]);

  const resetFileInput = () => {
    const fileInput = document.getElementById("widgetMediaUpload");
    fileInput.value = "";
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRemoveFile = (fileId) => {
    setFormData((prevState) => ({
      ...prevState,
      files: prevState.files.filter(({ id }) => fileId !== id),
    }));
  };

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) {
      return;
    }

    const isValid = handleValidateFiles(files);
    if (!isValid) {
      resetFileInput();
      return;
    }

    try {
      const compressedFiles = await handleCompressedFiles(files);
      setFormData((prevState) => ({
        ...prevState,
        files: [...prevState.files, ...compressedFiles],
      }));
    } catch (error) {
      addToast(
        "Failed to process the uploaded files. Please try again.",
        TOAST_ERROR_TYPE
      );
    }
  };

  const handleFileChange = async (e) => {
    const { files } = e.target;
    await handleUploadFiles(files);
    resetFileInput();
  };

  // const handleOnDragOver = (e) => {
  //   e.preventDefault();
  //   setIsDragActive(true);
  // };

  // const handleOnDragLeave = (e) => {
  //   e.preventDefault();
  //   setIsDragActive(false);
  // };

  const handleValidateFiles = (files) => {
    if (files.length + formData.files.length > TOTAL_MEDIA_COUNT) {
      addToast(filesLimitErrorMessage, TOAST_ERROR_TYPE);
      return false;
    }
    const { errorFileSize, errorFileType } = validateFiles(files);
    if (errorFileSize) {
      addToast(filesSizeErrorMessage, TOAST_ERROR_TYPE);
      return false;
    }
    if (errorFileType) {
      addToast(filesFormatErrorMessage, TOAST_ERROR_TYPE);
      return false;
    }
    return true;
  };

  const uploadImages = async (files) => {
    if (!Array.isArray(files)) {
      throw new Error("Input must be an array of files");
    }

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const { data } = await apiClient.post(uploadImageURL(), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
      } catch (error) {
        return null;
      }
    });

    const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean);
    return uploadedImages;
  };

  const handleOnDrop = async (e) => {
    e.preventDefault();
    const { files } = e?.dataTransfer;
    await handleUploadFiles(files);
  };

  const addAccount = (account) => {
    setSelectedAccounts((prevState) => [...prevState, account]);
  };

  const removeAccount = useCallback(
    (accountId) => {
      setSelectedAccounts((prevState) => {
        return prevState.filter(({ id }) => id !== accountId);
      });
    },
    [setSelectedAccounts]
  );

  const createPost = async (e) => {
    e.stopPropagation();
    setCreatePostLoading(true);
    try {
      const { files, content } = formData;
      const uploadedImages = await uploadImages(files.map(({ file }) => file));
      const mediaSocials = uploadedImages?.map((file) => {
        const { originalname, key } = file;
        return {
          url: key,
          isSelected: true,
          type: "image",
          name: originalname,
        };
      });
      const addPageAndChannel = (pageId, channel) => {
        postData.pageIds.push(pageId);
        if (!postData.channels.includes(channel)) {
          postData.channels.push(channel);
        }
      };

      const postData = {
        fullBody: `<br/>${content.split("\n").join("<br/>")}`,
        mediaSocials: mediaSocials,
        twitter: false,
        linkedin: false,
        pageIds: [],
        channels: [],
      };

      selectedAccounts.forEach((account) => {
        const { key, id } = account;
        switch (key) {
          case SOCIAL_PROVIDER_KEY_FACEBOOK:
            addPageAndChannel(id, FACEBOOK_CHANNEL_VALUE);
            break;
          case SOCIAL_PROVIDER_KEY_INSTAGRAM:
            addPageAndChannel(id, INSTAGRAM_CHANNEL_VALUE);
            break;
          case SOCIAL_PROVIDER_KEY_LINKEDIN:
            postData.linkedin = true;
            addPageAndChannel(id, LINKEDIN_CHANNEL_VALUE);
            break;
          case SOCIAL_PROVIDER_KEY_TWITTER:
            postData.twitter = true;
            addPageAndChannel(id, TWITTER_CHANNEL_VALUE);
            break;
          default:
            break;
        }
      });
      await apiClient.post(createPostURL(), postData);
      if (refreshTable) {
        await new Promise((resolve) => {
          setTimeout(() => {
            refreshTable();
            resolve();
          }, 2000);
        });
      }
      addToast(createdPostSuccessfullyMessage, TOAST_SUCCESS_TYPE);
      handleClose();
    } catch (error) {
      addToast(createdPostFailedMessage, TOAST_ERROR_TYPE);
    } finally {
      setCreatePostLoading(false);
    }
  };

  // const handlePreviewPost = () => {
  //   setIsShowPreview((prevState) => !prevState);
  // };
  const { files, content } = formData;

  const selectedAccountsKeys = selectedAccounts.map(({ key }) => key);
  const minContentCharacterCount =
    getMinContentCharacterCountByProviderKeys(selectedAccountsKeys);

  const contentCharacterCount = content.length;
  const hasFiles = files.length > 0;
  const hasSelectedAccounts = selectedAccounts.length > 0;
  const hasInstagramAccount = selectedAccounts.some(
    ({ key }) => key === SOCIAL_PROVIDER_KEY_INSTAGRAM
  );

  const isContentValid = contentCharacterCount > 0;

  const isContentLengthValid =
    contentCharacterCount <= minContentCharacterCount;

  const isContentAndFilesValid =
    isContentLengthValid && (isContentValid || hasFiles);
  const requiresImages = !hasFiles && hasInstagramAccount;

  const isPostButtonDisabled =
    !isContentAndFilesValid || !hasSelectedAccounts || requiresImages;

  const recommendedImageAspectRatiosText = `Recommended image aspect ratios: ${getRecommendedAspectRatios(
    selectedAccountsKeys
  )}`;

  const isVisibleRecommendedImageAspectRatios =
    selectedAccountsKeys.length && files.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      modalContentClassName={styles.createPostModalContent}
    >
      <div className={styles.modalTitle}>Post to Social Media Accounts</div>

      <div className={styles.modalDescriptions}>
        Please choose the social media account(s) you want to post to, and add
        the description/image of the post.
      </div>
      <div className={styles.contentWrap}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1, width: "100%" }}>
            <div className={styles.accountBox}>
              {!!selectedAccounts.length ? (
                <SelectedAccounts
                  selectedAccountForCustomize={selectedAccountForCustomize}
                  setSelectedAccountForCustomize={
                    setSelectedAccountForCustomize
                  }
                  selectedAccounts={selectedAccounts}
                  removeAccount={removeAccount}
                  formData={formData}
                  styles={styles}
                />
              ) : null}
              <AddAccountButton
                addAccount={addAccount}
                isLoading={isLoading}
                selectedAccounts={selectedAccounts}
                showButtonText={selectedAccounts.length}
                facebookAndInstagramProviders={facebookAndInstagramProviders}
                twitterAndLinkedProviders={twitterAndLinkedProviders}
              />
            </div>
            <div
              className={styles.inputsWrap}
              // onDragOver={handleOnDragOver}
              // onDragLeave={handleOnDragLeave}
              onDrop={handleOnDrop}
            >
              {/* <CustomizeSection
                handlePreviewPost={handlePreviewPost}
                isShowPreview={isShowPreview}
                setIsCustomize={setIsCustomize}
                isCustomize={isCustomize}
              /> */}
              <TextareaInput
                className={styles.contentInput}
                value={content}
                onChange={onChange}
              />
              <ViewUploadedFilesInfo
                files={files}
                handleRemoveFile={handleRemoveFile}
                styles={styles}
              />
            </div>

            <div className={styles.emojiFileWrapper}>
              {/* <div className={styles.emojiWrap}>
                <EmojiIcon />
              </div> */}
              <div className={styles.mediaAttachmentAndWarningIconWrap}>
                <MediaAttachment
                  handleFileChange={handleFileChange}
                  isDisabled={files.length === TOTAL_MEDIA_COUNT}
                  styles={styles}
                />
                {requiresImages && (
                  <Tooltip title={attachMediaIsRequiredMessage} isShow={true}>
                    <WarningIcon />
                  </Tooltip>
                )}
              </div>
              {!!selectedAccountsKeys.length && (
                <CharacterCountIndicator
                  contentCharacterCount={contentCharacterCount}
                  minContentCharacterCount={minContentCharacterCount}
                  isAboveMin={!isContentLengthValid}
                />
              )}
            </div>
          </div>
          {/* {isShowPreview ? (
            <PreviewSection
              isShowPreview={isShowPreview}
              providersForPreview={selectedAccounts}
            />
          ) : null} */}
        </div>

        {isVisibleRecommendedImageAspectRatios ? (
          <div className={styles.recommendedImageAspectRatioBox}>
            <Tooltip
              title={tooltipTitleForRecommendedImageAspectRatio}
              isShow={true}
            >
              <InfoIcon />
            </Tooltip>
            {recommendedImageAspectRatiosText}
          </div>
        ) : null}
      </div>
      <div className={styles.actionButtonsWrap}>
        <SecondaryButton color="secondary" onClick={handleClose}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          className={styles.postBtn}
          disabled={isPostButtonDisabled || createPostLoading}
          isLoading={createPostLoading}
          onClick={createPost}
        >
          Post
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default CreateNewPostModal;
