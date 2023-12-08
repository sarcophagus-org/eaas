import { SarcophagusDataWithClientEmail } from "types/sarcophagi";
import { ActionMap } from "../ActionMap";

export enum ActionType {
  SetClientSarcophagi = "SARCO_SET_CLIENT_SARCOPHAGI",
}

type SarcophagiPayload = {
  [ActionType.SetClientSarcophagi]: { clientSarcophagi: SarcophagusDataWithClientEmail[] };
};

export function setClientSarcophagi(
  clientSarcophagi: SarcophagusDataWithClientEmail[],
): SarcophagiActions {
  return {
    type: ActionType.SetClientSarcophagi,
    payload: {
      clientSarcophagi,
    },
  };
}

export type SarcophagiActions = ActionMap<SarcophagiPayload>[keyof ActionMap<SarcophagiPayload>];
