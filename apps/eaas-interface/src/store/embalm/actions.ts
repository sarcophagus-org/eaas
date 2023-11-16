import { ActionMap } from "../ActionMap";

export enum ActionType {
  SetCustomResurrectionDate = "EMBALM_SET_CUSTOM_RESURRECTION_DATE",
  SetFile = "EMBALM_SET_FILE",
  SetRecipientState = "EMBALM_SET_RECIPIENT_STATE",
  SetResurrection = "EMBALM_SET_RESURRECTION",
  SetResurrectionRadioValue = "EMBALM_SET_RESURRECTION_RADIO_VALUE",
}

export enum GeneratePDFState {
  UNSET,
  GENERATED,
  DOWNLOADED,
}

export enum SortDirection {
  ASC,
  DESC,
  NONE,
}

export interface RecipientState {
  address: string;
  publicKey: string;
  privateKey?: string;
  generatePDFState?: GeneratePDFState;
}

type EmbalmPayload = {
  [ActionType.SetCustomResurrectionDate]: { date: Date | null };
  [ActionType.SetFile]: { file: File };
  [ActionType.SetRecipientState]: RecipientState;
  [ActionType.SetResurrection]: { resurrection: number };
  [ActionType.SetResurrectionRadioValue]: { value: string };
};

export function setFile(file: File): EmbalmActions {
  return {
    type: ActionType.SetFile,
    payload: {
      file,
    },
  };
}

export function setResurrection(resurrection: number): EmbalmActions {
  return {
    type: ActionType.SetResurrection,
    payload: {
      resurrection,
    },
  };
}

export function setResurrectionRadioValue(value: string): EmbalmActions {
  return {
    type: ActionType.SetResurrectionRadioValue,
    payload: {
      value,
    },
  };
}

export function setCustomResurrectionDate(date: Date | null): EmbalmActions {
  return {
    type: ActionType.SetCustomResurrectionDate,
    payload: {
      date,
    },
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
