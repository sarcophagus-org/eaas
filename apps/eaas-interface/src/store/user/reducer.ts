import { Actions } from "..";
import { EaasTokens, EaasUser } from "../../types/userTypes";
import { ActionType } from "./actions";

export interface UserState {
  tokens: EaasTokens | null;
  user: EaasUser | null;
}

export const userInitialState: UserState = {
  tokens: null,
  user: null,
};

export function userReducer(state: UserState, action: Actions): UserState {
  switch (action.type) {
    case ActionType.SetTokens:
      return { ...state, tokens: action.payload.tokens };

    case ActionType.SetUser:
      return { ...state, user: action.payload.user };

    default:
      return state;
  }
}
