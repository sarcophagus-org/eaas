export enum UserType {
  embalmer = "embalmer",
  client = "client",
}

export interface RegisterUser {
  password: string;
}

export interface EaasUser {
  id: string;
  email: string;
  type: UserType;
}

export interface EaasToken {
  token: string;
  expires: Date;
}

export interface EaasTokens {
  access: EaasToken;
  refresh: EaasToken;
}

export interface EaasLoginResponse {
  user: EaasUser;
  tokens: EaasTokens;
}
