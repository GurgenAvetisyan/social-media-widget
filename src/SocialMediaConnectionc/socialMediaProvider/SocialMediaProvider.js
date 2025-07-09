import React, { memo } from "react";
import {
  SOCIAL_PROVIDER_KEY_FACEBOOK,
  SOCIAL_PROVIDER_KEY_INSTAGRAM,
} from "../config";
import TextButton from "../components/buttons/TextButton";

import styles from "./socialMediaProvider.module.css";

const SocialMediaProvider = ({
  icon,
  name,
  connected,
  providerKey,
  handleProviderConnectAndDisconnect,
  handleProviderManagePages,
}) => {
  return (
    <div className={styles.socialMediaProvider}>
      <div className={styles.socialMediaProviderInfoBlock}>
        <div className={styles.iconBlock}>{icon}</div>
        <p className={styles.socialMediaProviderTitle}>{name}</p>
      </div>
      <div className={styles.actionButtonsWrap}>
        <TextButton
          className={connected ? styles.disconnectBtn : ""}
          onClick={(e) => {
            e.stopPropagation();
            handleProviderConnectAndDisconnect({
              icon,
              name,
              connected,
              providerKey,
            });
          }}
        >
          {connected ? "Disconnect" : "Connect"}
        </TextButton>

        {(providerKey === SOCIAL_PROVIDER_KEY_FACEBOOK ||
          providerKey === SOCIAL_PROVIDER_KEY_INSTAGRAM) &&
          connected && (
            <TextButton
              className={styles.managePageBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleProviderManagePages(providerKey);
              }}
            >
              Manage
            </TextButton>
          )}
      </div>
    </div>
  );
};

export default memo(SocialMediaProvider);
