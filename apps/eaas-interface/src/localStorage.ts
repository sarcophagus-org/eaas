import { EaasToken } from "./types/userTypes";

type TokenType = "access" | "refresh";

const setToken = (type: TokenType, token: EaasToken) =>
  localStorage.setItem(`${type}_token`, JSON.stringify(token));

const getToken = (type: TokenType): EaasToken | undefined => {
  const token = localStorage.getItem(`${type}_token`);
  if (token) {
    return JSON.parse(token) as EaasToken;
  }
};

export const getAccessToken = (): EaasToken | undefined => getToken("access");
export const setAccessToken = (token: EaasToken) => setToken("access", token);

export const getRefreshToken = (): EaasToken | undefined => getToken("refresh");
export const setRefreshToken = (token: EaasToken) => setToken("refresh", token);

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
