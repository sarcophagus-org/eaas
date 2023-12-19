import { EaasToken, EaasUser } from "./types/userTypes";

type TokenType = "access" | "refresh";

export const saveUser = (user: EaasUser | null) =>
  user ? localStorage.setItem("user", JSON.stringify(user)) : localStorage.removeItem("user");
export const getUser = (): EaasUser | null => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user) as EaasUser;
  }
  return null;
};

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
