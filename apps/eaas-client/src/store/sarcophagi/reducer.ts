import { SarcophagusDataWithClientEmail } from "types/sarcophagi";
import { Actions } from "..";
import { ActionType } from "./actions";

export interface SarcophagiState {
  userSarcophagi: SarcophagusDataWithClientEmail[];
}

export const sarcophagiInitialState: SarcophagiState = {
  userSarcophagi: [],
};

export function sarcophagiReducer(state: SarcophagiState, action: Actions): SarcophagiState {
  switch (action.type) {
    case ActionType.SetUserSarcophagi:
      return { ...state, userSarcophagi: action.payload.userSarcophagi };

    default:
      return state;
  }
}
