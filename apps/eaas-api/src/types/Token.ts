export interface TokenDb {
  token: string;
  user_id: string;
  expires: string;
  type: string;
  blacklisted?: boolean;
}

export interface UserTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}

export enum TokenType {
  access = "access",
  refresh = "refresh",
  resetPassword = "reset_password",
  verifyEmail = "verify_email",
  invite = "invite",
}

export const AuthTokenTypes = [TokenType.access, TokenType.refresh];
