import axios from "axios";
import { useAuth } from "./AuthContext";

const apiClient = axios.create();

export const useApiClient = () => {
  const { token, secretKey, clientSecret, source } = useAuth();

  apiClient.interceptors.request.use(
    (config) => {

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      if (secretKey) {
        config.headers["x-secret-key"] = secretKey;
      }
      if (clientSecret) {
        config.headers["x-client-secret"] = clientSecret;
      }
      if (source) {
        config.headers["X-Source"] = source;
      }
      // config.headers["Content-Type"] = "application/json";
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
      return config;
    },
    (error) => Promise.reject(error)
  );

  return apiClient;
};
