import { EaasTokens, EaasUser } from "../types/userTypes";

export let adminUser: EaasUser | null = null;
export let adminTokens: EaasTokens | null = null;
export const setUser = (user: EaasUser) => (adminUser = user);
export const setTokens = (tokens: EaasTokens) => (adminTokens = tokens);
