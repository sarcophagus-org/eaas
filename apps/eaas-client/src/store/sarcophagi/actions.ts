import { SarcophagusDataWithClientEmail } from "types/sarcophagi";
import { ActionMap } from "../ActionMap";

export enum ActionType {
  SetUserSarcophagi = "SARCO_SET_USER_SARCOPHAGI",
}

type SarcophagiPayload = {
  [ActionType.SetUserSarcophagi]: { userSarcophagi: SarcophagusDataWithClientEmail[] };
};

export function setUserSarcophagi(
  userSarcophagi: SarcophagusDataWithClientEmail[],
): SarcophagiActions {
  return {
    type: ActionType.SetUserSarcophagi,
    payload: {
      userSarcophagi,
    },
  };
}

export type SarcophagiActions = ActionMap<SarcophagiPayload>[keyof ActionMap<SarcophagiPayload>];
