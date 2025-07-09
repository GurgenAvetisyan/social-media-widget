import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SOCIAL_PROVIDER_KEY_FACEBOOK,
  SOCIAL_PROVIDER_KEY_INSTAGRAM,
  SOCIAL_PROVIDER_KEY_TWITTER,
  SOCIAL_PROVIDER_KEY_LINKEDIN,
  SOCIAL_PROVIDER_TWITTER_KEY,
  SOCIAL_PROVIDER_LOGIN_URL_TWITTER,
  SOCIAL_PROVIDER_LOGIN_URL_INSTAGRAM,
  SOCIAL_PROVIDER_LOGIN_URL_LINKEDIN,
  SOCIAL_PROVIDER_ALIAS_FACEBOOK,
  SOCIAL_PROVIDER_ALIAS_INSTAGRAM,
  SOCIAL_PROVIDER_ALIAS_LINKEDIN,
  SOCIAL_PROVIDER_ALIAS_TWITTER,
  REDIRECT_SOCIAL_PROVIDER_LOGIN_URL_LINKEDIN,
  SOCIAL_PROVIDER_LOGIN_URL_FACEBOOK,
} from "./config";

import {
  getSocialIntegrationSettingsURL,
  getSocialProviderPagesURL,
} from "./apis";

import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "../assets/icons";
import Accordion from "./components/Accordion";
import Loading from "./components/Loading";
import SocialMediaProvider from "./socialMediaProvider";
import CreatePostButton from "./components/CreatePostButton";

import TwitterOverloadedDialog from "./dialogs/TwitterOverloadedDialog";
import DisconnectDialog from "./dialogs/DisconnectDialog";
import SocialMediaPagesModal from "./dialogs/SocialMediaPagesModal";

import { useApiClient } from "../useApiClient";
import { useAuth } from "../AuthContext";
import { useToast } from "./components/Toast/ToastContext";
import {
  TOAST_ERROR_TYPE,
  TOAST_SUCCESS_TYPE,
} from "./components/Toast/constants";
import { wrongMessage } from "./constants";
import { handleDisplayingToastSuccessfulConnection } from "./helpers";

import styles from "./saocialMediaConnection.module.css";

const initialSocialProvidersState = [
  {
    icon: <FacebookIcon />,
    name: "Facebook",
    connected: false,
    key: SOCIAL_PROVIDER_KEY_FACEBOOK,
    alias: SOCIAL_PROVIDER_ALIAS_FACEBOOK,
  },
  {
    icon: <InstagramIcon />,
    name: "Instagram",
    connected: false,
    key: SOCIAL_PROVIDER_KEY_INSTAGRAM,
    alias: SOCIAL_PROVIDER_ALIAS_INSTAGRAM,
  },
  {
    icon: <LinkedInIcon />,
    name: "LinkedIn",
    connected: false,
    key: SOCIAL_PROVIDER_KEY_LINKEDIN,
    alias: SOCIAL_PROVIDER_ALIAS_LINKEDIN,
  },
  {
    icon: <TwitterIcon />,
    name: "Twitter",
    connected: false,
    key: SOCIAL_PROVIDER_KEY_TWITTER,
    alias: SOCIAL_PROVIDER_ALIAS_TWITTER,
  },
];

const SocialMediaIntegrations = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSocialProvider, setSelectedSocialProvider] = useState({});
  const [isTwitterOverloadedModalClosed, setIsTwitterOverloadedModalClosed] =
    useState(false);
  const [isDisconnectModalOpened, setIsDisconnectModalOpened] = useState(false);
  const [isSocialMediaPagesModalOpened, setIsSocialMediaPagesModalOpened] =
    useState(false);
  const [isInstagramModal, setIsInstagramModal] = useState(false);
  const [socialProviders, setSocialProviders] = useState(
    initialSocialProvidersState
  );
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const [isShowCreatePostSection, setIsShowCreatePostSection] = useState(false);

  const apiClient = useApiClient();
  const { secretKey } = useAuth();
  const { addToast } = useToast();

  const fetchSettings = useCallback(async () => {
    setIsLoaded(true);
    try {
      const { data } = await apiClient.get(getSocialIntegrationSettingsURL());
      if (data.twitterToken) {
        localStorage.setItem(SOCIAL_PROVIDER_TWITTER_KEY, data.twitterToken);
      }

      setSocialProviders((prevState) =>
        prevState.map((provider) => ({
          ...provider,
          connected: data?.[`${provider.alias}Connected`],
        }))
      );

      handleDisplayingToastSuccessfulConnection(data, (platformName) => {
        addToast(
          `${platformName} account successfully connected.`,
          TOAST_SUCCESS_TYPE
        );
      });
    } catch (error) {
      addToast(wrongMessage, TOAST_ERROR_TYPE);
    } finally {
      setIsLoaded(false);
    }
  }, [apiClient, addToast]);

  useEffect(() => {
    const fetchProviderPages = async () => {
      try {
        const response = await apiClient.get(getSocialProviderPagesURL());
        const pages = response.data || {};
        const hasConnectedPages = Object.values(pages).some((providerPages) =>
          providerPages.some(({ status }) => !!status)
        );

        setIsShowCreatePostSection(hasConnectedPages);
      } catch (error) {
        setIsShowCreatePostSection(false);
      }
    };

    const connectedProviders = socialProviders.reduce(
      (acc, { connected, alias }) => {
        acc[`${alias}Connected`] = connected;
        return acc;
      },
      {}
    );

    const {
      facebookConnected = false,
      instagramConnected = false,
      linkedinConnected = false,
      twitterConnected = false,
    } = connectedProviders;

    const isAnySocialProviderConnected =
      facebookConnected ||
      instagramConnected ||
      linkedinConnected ||
      twitterConnected;

    const isFacebookOrInstagramConnected =
      facebookConnected || instagramConnected;
    const isLinkedInOrTwitterConnected = linkedinConnected || twitterConnected;

    if (!isAnySocialProviderConnected) {
      setIsShowCreatePostSection(false);
      return;
    }

    if (isFacebookOrInstagramConnected && !isLinkedInOrTwitterConnected) {
      fetchProviderPages();
    } else {
      setIsShowCreatePostSection(true);
    }
  }, [socialProviders, apiClient]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleProviderConnectAndDisconnect = useCallback(
    ({ providerKey, ...rest }) => {
      const providerHandlers = {
        [SOCIAL_PROVIDER_KEY_FACEBOOK]: handleFacebookProvider,
        [SOCIAL_PROVIDER_KEY_TWITTER]: handleTwitterProvider,
        [SOCIAL_PROVIDER_KEY_INSTAGRAM]: handleInstagramProvider,
        [SOCIAL_PROVIDER_KEY_LINKEDIN]: handleLinkedinProvider,
      };

      const handler = providerHandlers[providerKey];

      if (handler) {
        handler({ providerKey, ...rest });
      }
    },
    []
  );

  const handleProviderManagePages = useCallback((providerKey) => {
    const providerHandlers = {
      [SOCIAL_PROVIDER_KEY_FACEBOOK]: handleFacebookPagesModalOpening,
      [SOCIAL_PROVIDER_KEY_INSTAGRAM]: handleInstagramPagesModalOpening,
    };
    const handler = providerHandlers[providerKey];

    if (handler) {
      handler();
    }
  }, []);

  const handleFacebookProvider = (socialProvider) => {
    if (!socialProvider.connected) {
      const state = {
        secretKey,
        providerKey: SOCIAL_PROVIDER_KEY_FACEBOOK,
      };
      window.location.href = `${SOCIAL_PROVIDER_LOGIN_URL_FACEBOOK}&state=${encodeURIComponent(
        JSON.stringify(state)
      )}`;
    } else {
      openDisconnectConfirmationModal(socialProvider);
    }
  };

  const handleTwitterProvider = (socialProvider) => {
    const twitterOauthToken = localStorage.getItem(SOCIAL_PROVIDER_TWITTER_KEY);
    if (!socialProvider.connected && twitterOauthToken) {
      window.location.href = `${SOCIAL_PROVIDER_LOGIN_URL_TWITTER}oauth_token=${twitterOauthToken}`;
    } else if (!twitterOauthToken) {
      setIsTwitterOverloadedModalClosed(true);
    } else {
      openDisconnectConfirmationModal(socialProvider);
    }
  };

  const handleInstagramProvider = (socialProvider) => {
    if (!socialProvider.connected) {
      const state = {
        secretKey,
        providerKey: SOCIAL_PROVIDER_KEY_INSTAGRAM,
      };
      window.location.href = `${SOCIAL_PROVIDER_LOGIN_URL_INSTAGRAM}&state=${encodeURIComponent(
        JSON.stringify(state)
      )}`;
    } else {
      openDisconnectConfirmationModal(socialProvider);
    }
  };

  const handleLinkedinProvider = (socialProvider) => {
    if (!socialProvider.connected) {
      const state = {
        secretKey,
        providerKey: SOCIAL_PROVIDER_KEY_LINKEDIN,
      };

      window.location.href = `${SOCIAL_PROVIDER_LOGIN_URL_LINKEDIN}${encodeURI(
        `${REDIRECT_SOCIAL_PROVIDER_LOGIN_URL_LINKEDIN}&state=${JSON.stringify(
          state
        )}`
      )}`;
    } else {
      openDisconnectConfirmationModal(socialProvider);
    }
  };

  const openDisconnectConfirmationModal = (socialProvider) => {
    setSelectedSocialProvider(socialProvider);
    setIsDisconnectModalOpened(true);
  };

  const closeDisconnectConfirmationModal = () => {
    setSelectedSocialProvider({});
    setIsDisconnectModalOpened(false);
  };

  const handlePagesModalClose = () => {
    if (isInstagramModal) {
      setIsInstagramModal(false);
    }
    setIsSocialMediaPagesModalOpened(false);
  };

  const handleFacebookPagesModalOpening = () => {
    setIsSocialMediaPagesModalOpened(true);
  };

  const handleInstagramPagesModalOpening = () => {
    setIsInstagramModal(true);
    setIsSocialMediaPagesModalOpened(true);
  };

  const handleTwitterUnavailableModalClose = () =>
    setIsTwitterOverloadedModalClosed(false);

  const twitterAndLinkedProviders = useMemo(
    () =>
      socialProviders
        .filter(
          ({ key, connected }) =>
            [
              SOCIAL_PROVIDER_KEY_TWITTER,
              SOCIAL_PROVIDER_KEY_LINKEDIN,
            ].includes(key) && connected
        )
        .map(({ icon, name, key }) => ({ icon, name, key })),
    [socialProviders]
  );

  return (
    <div className={styles.saocialMediaConnectionWidget}>
      <Accordion>
        {isLoaded ? (
          <Loading />
        ) : (
          <div className={styles.socialProvidersWrap}>
            {socialProviders.map(({ key, ...provider }) => (
              <SocialMediaProvider
                key={key}
                {...provider}
                providerKey={key}
                handleProviderConnectAndDisconnect={
                  handleProviderConnectAndDisconnect
                }
                handleProviderManagePages={handleProviderManagePages}
              />
            ))}
          </div>
        )}
      </Accordion>

      {isSocialMediaPagesModalOpened && (
        <SocialMediaPagesModal
          onClose={handlePagesModalClose}
          setSocialProviders={setSocialProviders}
          setSelectedAccounts={setSelectedAccounts}
          isInstagramModal={isInstagramModal}
        />
      )}

      {isShowCreatePostSection ? (
        <CreatePostButton
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          twitterAndLinkedProviders={twitterAndLinkedProviders}
        />
      ) : null}
      <DisconnectDialog
        isOpen={isDisconnectModalOpened}
        setSelectedAccounts={setSelectedAccounts}
        onClose={closeDisconnectConfirmationModal}
        setSocialProviders={setSocialProviders}
        providerKey={selectedSocialProvider?.providerKey}
        name={selectedSocialProvider?.name}
      />
      <TwitterOverloadedDialog
        onClose={handleTwitterUnavailableModalClose}
        isOpen={isTwitterOverloadedModalClosed}
      />
    </div>
  );
};

export default SocialMediaIntegrations;
