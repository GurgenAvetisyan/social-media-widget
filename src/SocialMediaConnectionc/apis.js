export const getSocialIntegrationSettingsURL = () =>
  `${process.env.REACT_APP_API_HOSTNAME}/open-api/social/settings`;

export const disconnectSocialProviderURL = () =>
  `${process.env.REACT_APP_API_HOSTNAME}/open-api/social/disconnect`;

export const connectSocialProviderURL = () =>
  `${process.env.REACT_APP_API_HOSTNAME}/open-api/social/login`;

export const getSocialProviderPagesURL = () =>
  `${process.env.REACT_APP_API_HOSTNAME}/open-api/social/pages`;

export const updateSocialPageConnectionStatusURL = ({
  socialProviderKey,
  pageId,
}) =>
  `${process.env.REACT_APP_API_HOSTNAME}/open-api/social/${socialProviderKey}/pages/${pageId}`;
  
export const createPostURL = () =>
  `${process.env.REACT_APP_API_HOSTNAME}/open-api/social/posts`;

export const uploadImageURL = () =>
  `${process.env.REACT_APP_API_HOSTNAME}/open-api/social/files/upload`;
