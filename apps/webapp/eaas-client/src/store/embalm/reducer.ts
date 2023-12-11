import { Actions } from "..";
import { ActionType, RecipientState } from "./actions";

export interface EmbalmState {
  customResurrectionDate: Date | null;
  file: File | null;
  recipientState: RecipientState;
  resurrection: number;
  resurrectionRadioValue: string;
}

export const embalmInitialState: EmbalmState = {
  customResurrectionDate: null,
  file: null,
  recipientState: {
    address: "",
    publicKey: "",
    sarcoId: "",
  },
  resurrection: 0,
  resurrectionRadioValue: "",
};

export function embalmReducer(state: EmbalmState, action: Actions): EmbalmState {
  switch (action.type) {
    case ActionType.SetRecipientState:
      return {
        ...state,
        recipientState: {
          publicKey: action.payload.publicKey,
          address: action.payload.address,
          sarcoId: action.payload.sarcoId,
          privateKey: action.payload.privateKey,
          generatePDFState: action.payload.generatePDFState,
          pdfBlob: action.payload.pdfBlob,
        },
      };

    case ActionType.SetFile:
      return { ...state, file: action.payload.file };

    case ActionType.SetResurrection:
      return { ...state, resurrection: action.payload.resurrection };

    case ActionType.SetResurrectionRadioValue:
      return { ...state, resurrectionRadioValue: action.payload.value };

    case ActionType.SetCustomResurrectionDate:
      return { ...state, customResurrectionDate: action.payload.date };

    default:
      return state;
  }
}
