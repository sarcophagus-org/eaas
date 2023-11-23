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
}

const localStorageUser = getUser();

export const userInitialState: UserState = {
  tokens: null,
  user: localStorageUser,
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

    default:
      return state;
  }
}
