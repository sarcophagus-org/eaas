import { EaasTokens, EaasUser } from "../types/userTypes";

export let appUser: EaasUser | undefined;
export let userTokens: EaasTokens | undefined;
export const setUser = (user: EaasUser) => (appUser = user);
export const setTokens = (tokens: EaasTokens) => (userTokens = tokens);

export let selectedFile: File | undefined;
export const setSelectedFile = (file: File) => (selectedFile = file);
