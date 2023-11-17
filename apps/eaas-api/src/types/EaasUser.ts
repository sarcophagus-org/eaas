import { Identifiable } from "./Identifiable";
import { Request } from "express";

export enum UserType {
  embalmer = "embalmer",
  client = "client",
}

export interface EaasUser extends Identifiable {
  email: string;
  password: string;
  type: UserType;
  is_email_verified: boolean;
}

export type RequestWithUser = Request & { user: EaasUser };
