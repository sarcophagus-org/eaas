import { Invitation } from "types/invitation";
import { Actions } from "..";
import {
  clearTokens,
  getUser,
  saveUser,
  setAccessToken,
  setRefreshToken,
} from "../../localStorage";
import { EaasTokens, EaasUser } from "../../types/userTypes";
import { ActionType } from "./actions";

export interface UserState {
  tokens: EaasTokens | null;
  user: EaasUser | null;
  invites: Invitation[];
}

const localStorageUser = getUser();

export const userInitialState: UserState = {
  tokens: null,
  user: localStorageUser,
  invites: [],
};

export function userReducer(state: UserState, action: Actions): UserState {
  switch (action.type) {
    case ActionType.SetTokens:
      if (action.payload.tokens) {
        setAccessToken(action.payload.tokens!.access);
        setRefreshToken(action.payload.tokens!.refresh);
      }
      return { ...state, tokens: action.payload.tokens };

    case ActionType.ClearTokens:
      clearTokens();
      return { ...state, tokens: null };

    case ActionType.SetUser:
      saveUser(action.payload.user);
      return { ...state, user: action.payload.user };

    case ActionType.SetInvites:
      return { ...state, invites: action.payload.invites };

    default:
      return state;
  }
}
