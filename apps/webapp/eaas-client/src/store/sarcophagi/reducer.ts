import { SarcophagusDataWithClientEmail } from "types/sarcophagi";
import { Actions } from "..";
import { ActionType } from "./actions";

export interface SarcophagiState {
  clientSarcophagi: SarcophagusDataWithClientEmail[];
}

export const sarcophagiInitialState: SarcophagiState = {
  clientSarcophagi: [],
};

export function sarcophagiReducer(state: SarcophagiState, action: Actions): SarcophagiState {
  switch (action.type) {
    case ActionType.SetClientSarcophagi:
      return { ...state, clientSarcophagi: action.payload.clientSarcophagi };

    default:
      return state;
  }
}
