import {
  SOCIAL_PROVIDER_KEY_FACEBOOK,
  SOCIAL_PROVIDER_KEY_INSTAGRAM,
  SOCIAL_PROVIDER_KEY_LINKEDIN,
  SOCIAL_PROVIDER_KEY_TWITTER,
} from "../../config";
import {
  MEDIA_ATTACHMENT_AND_CONTENT_CONDITIONS,
  ACCEPTABLE_FILE_FORMATS,
  MAX_FILE_SIZE,
} from "./constants";

export const validateContent = (providerKey, content) => {
  const condition = MEDIA_ATTACHMENT_AND_CONTENT_CONDITIONS.find(
    (cond) => cond.providerKey === providerKey
  );

  if (!condition) {
    return false;
  }

  const isValidLength = content.length <= condition.contentCharacterCount;

  if (!isValidLength) {
    // console.error("Content exceeds the allowed character count");
  }

  return isValidLength;
};

export const validateMediaFile = (providerKey, file) => {
  const condition = MEDIA_ATTACHMENT_AND_CONTENT_CONDITIONS.find(
    (cond) => cond.providerKey === providerKey
  );

  if (!condition) {
    return false;
  }
  const isValidType = condition.types.includes(file.type);
  const isValidSize = file.size <= condition.size;
  if (!isValidType) {
    // console.error("Invalid file type");
  }

  if (!isValidSize) {
    // console.error("File is too large");
  }
  return isValidType && isValidSize;
};

export const validateFiles = (files) => {
  const errors = {
    errorFileSize: false,
    errorFileType: false,
  };
  for (const file of files) {
    if (!ACCEPTABLE_FILE_FORMATS.includes(file.type)) {
      errors.errorFileType = true;
      return errors;
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.errorFileSize = true;
      return errors;
    }
  }

  return errors;
};

export const getMinContentCharacterCountByProviderKeys = (
  selectedProviderKeys
) => {
  const filteredConditions = MEDIA_ATTACHMENT_AND_CONTENT_CONDITIONS.filter(
    (item) => selectedProviderKeys.includes(item.providerKey)
  );

  if (filteredConditions.length > 0) {
    return Math.min(
      ...filteredConditions.map((item) => item.contentCharacterCount)
    );
  }

  return null;
};

export const getRecommendedAspectRatios = (platforms) => {
  const aspectRatios = {
    [SOCIAL_PROVIDER_KEY_FACEBOOK]: [
      "1:1",
      "1.91:1",
      "4:5",
      "2:3",
      "16:9",
      "9:16",
    ],
    [SOCIAL_PROVIDER_KEY_INSTAGRAM]: ["1:1", "1.91:1", "4:5", "16:9"],
    [SOCIAL_PROVIDER_KEY_TWITTER]: ["1:1", "1.91:1", "16:9"],
    [SOCIAL_PROVIDER_KEY_LINKEDIN]: ["1:1"],
  };

  let commonAspectRatios = aspectRatios[platforms[0]] || [];

  for (let i = 1; i < platforms.length; i++) {
    const platform = platforms[i];
    const currentRatios = aspectRatios[platform] || [];
    commonAspectRatios = commonAspectRatios.filter((ratio) =>
      currentRatios.includes(ratio)
    );
  }
  return commonAspectRatios.map((ratio) => ratio).join(", ");
};
