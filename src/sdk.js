import React from "react";
import ReactDOM from "react-dom/client";
import SocialMediaConnectionc from "./SocialMediaConnectionc";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./SocialMediaConnectionc/components/Toast/ToastContext";
import ToastContainer from "./SocialMediaConnectionc/components/Toast";

const IntegrationsSDK = (() => {
  const init = (selector, options) => {
    const container = document.querySelector(selector);
    if (!container) {
      console.error(`Container element not found for selector: ${selector}`);
      return;
    }

    const { secretKey, clientSecret, token, source } = options;
    if (!secretKey || !clientSecret || !token || !source ) {
      console.error(
        "Missing required settings: secretKey, clientSecret, source, or token."
      );
      return;
    }

    const root = ReactDOM.createRoot(container);
    root.render(
      <AuthProvider initialSettings={options}>
        <ToastProvider>
          <ToastContainer />
          <SocialMediaConnectionc />
        </ToastProvider>
      </AuthProvider>
    );
  };

  return { init };
})();

window.MS = IntegrationsSDK;