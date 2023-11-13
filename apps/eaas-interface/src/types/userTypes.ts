export interface RegisterUser {
  password: string;
}

export interface EaasUser {
  id: string;
  email: string;
  is_embalmer: true;
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
