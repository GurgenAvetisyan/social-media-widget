import React from "react";
import ReactDOM from "react-dom/client";
import App from "./SocialMediaConnectionc/SocialMediaConnectionWidget";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./SocialMediaConnectionc/components/Toast/ToastContext";
import ToastContainer from "./SocialMediaConnectionc/components/Toast";

const initialSettings = {
  refreshTable: () => {},
  secretKey: "",
  clientSecret: "",
  source: 1,
  token: "",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider initialSettings={initialSettings}>
    <ToastProvider>
      <ToastContainer />
      <App />
    </ToastProvider>
  </AuthProvider>
);
