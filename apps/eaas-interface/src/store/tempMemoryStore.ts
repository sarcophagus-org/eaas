import { EaasTokens, EaasUser } from "../types/userTypes";

export let appUser: EaasUser | null = null;
export let userTokens: EaasTokens | null = null;
export const setUser = (user: EaasUser) => (appUser = user);
export const setTokens = (tokens: EaasTokens) => (userTokens = tokens);
