export interface EaasUser {
  id: string;
  email: string;
  name: string;
  is_admin: true;
  phone?: string;
  profile_picture_key?: string;
}

export interface EaasToken {
  token: string;
  expires: Date;
}

export interface EaasLoginResponse {
  user: EaasUser;
  tokens: {
    access: EaasToken;
    refresh: EaasToken;
  };
}
