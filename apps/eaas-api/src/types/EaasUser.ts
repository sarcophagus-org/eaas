import { Identifiable } from "./Identifiable";
import { Request } from "express";

export interface EaasUser extends Identifiable {
  email: string;
  password: string;
  phone: string;
  name: string;
  is_email_verified: boolean;
  profile_picture_key?: string;
  is_admin: true;
}

export type RequestWithUser = Request & { user: EaasUser };
