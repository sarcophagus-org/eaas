import { Identifiable } from "./Identifiable";
import { Request } from "express";

export interface EaasUser extends Identifiable {
  email: string;
  password: string;
  name: string;
  is_email_verified: boolean;
  is_embalmer: true;
}

export type RequestWithUser = Request & { user: EaasUser };
