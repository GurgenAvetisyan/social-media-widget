import {
  SOCIAL_PROVIDER_KEY_FACEBOOK,
  SOCIAL_PROVIDER_KEY_INSTAGRAM,
  SOCIAL_PROVIDER_KEY_TWITTER,
  SOCIAL_PROVIDER_KEY_LINKEDIN,
} from "../../config";

export const TOTAL_MEDIA_COUNT = 4;
export const ACCEPTABLE_FILE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];
export const MAX_FILE_SIZE = 4000000;

export const MEDIA_ATTACHMENT_AND_CONTENT_CONDITIONS = [
  {
    providerKey: SOCIAL_PROVIDER_KEY_FACEBOOK,
    types: ["image/png", "image/jpeg", "image/jpg"],
    size: 4000000,
    contentCharacterCount: 63206,
    isRequiredMedia: false,
  },
  {
    providerKey: SOCIAL_PROVIDER_KEY_INSTAGRAM,
    types: ["image/png", "image/jpeg", "image/jpg"],
    size: 4000000,
    contentCharacterCount: 2200,
    isRequiredMedia: true,
  },
  {
    providerKey: SOCIAL_PROVIDER_KEY_TWITTER,
    types: ["image/png", "image/jpeg", "image/jpg"],
    size: 4000000,
    contentCharacterCount: 280,
    isRequiredMedia: false,
  },
  {
    providerKey: SOCIAL_PROVIDER_KEY_LINKEDIN,
    types: ["image/png", "image/jpeg", "image/jpg"],
    size: 4000000,
    contentCharacterCount: 3000,
    isRequiredMedia: false,
  },
];
