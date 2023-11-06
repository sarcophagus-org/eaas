import { Identifiable } from "./Identifiable";

export interface Token extends Identifiable {
  token: string;
  user_id: string;
  expires: string;
  type: string;
  blacklisted: boolean;
}

export interface TokenObject {
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
  Access = "access",
  Refresh = "refresh",
  ResetPassword = "reset_password",
  VerifyEmail = "verify_email",
  Invite = "invite",
}

export const AuthTokenTypes = [TokenType.Access, TokenType.Refresh];
