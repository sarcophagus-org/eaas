import { EaasTokens, EaasUser } from "../../types/userTypes";
import { ActionMap } from "../ActionMap";

export enum ActionType {
  SetUser = "USER_SET_USER",
  SetTokens = "USER_SET_TOKENS",
}

type UserPayload = {
  [ActionType.SetUser]: { user: EaasUser | null };
  [ActionType.SetTokens]: { tokens: EaasTokens | null };
};

export function setTokens(tokens: EaasTokens): UserActions {
  return {
    type: ActionType.SetTokens,
    payload: {
      tokens,
    },
  };
}

export function setUser(user: EaasUser): UserActions {
  return {
    type: ActionType.SetUser,
    payload: {
      user,
    },
  };
}

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];
