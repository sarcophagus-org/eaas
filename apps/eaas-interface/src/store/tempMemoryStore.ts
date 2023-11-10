import { EaasTokens, EaasUser } from "../types/EaasUser";

export let adminUser: EaasUser | null = null;
export let adminTokens: EaasTokens | null = null;
export const setAdminUser = (user: EaasUser) => adminUser = user;
export const setTokens = (tokens: EaasTokens) => adminTokens = tokens;