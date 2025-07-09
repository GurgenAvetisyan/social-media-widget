import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const authReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_AUTH":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children, initialSettings = {} }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    token: initialSettings.token || null,
    secretKey: initialSettings.secretKey || null,
    clientSecret: initialSettings.clientSecret || null,
    source: initialSettings.source || null,
    refreshTable: initialSettings.refreshTable || null,
  });

  const updateAuth = useCallback(
    (newToken, newSecretKey, newClientSecret, newSource, refreshTable) => {
      dispatch({
        type: "UPDATE_AUTH",
        payload: {
          token: newToken,
          secretKey: newSecretKey,
          clientSecret: newClientSecret,
          source: newSource,
          refreshTable,
        },
      });
    },
    []
  );

  useEffect(() => {
    if (initialSettings) {
      updateAuth(
        initialSettings.token,
        initialSettings.secretKey,
        initialSettings.clientSecret,
        initialSettings.source,
        initialSettings.refreshTable
      );
    }
  }, [initialSettings, updateAuth]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        updateAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
