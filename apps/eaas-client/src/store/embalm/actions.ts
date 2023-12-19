import { ActionMap } from "../ActionMap";

export enum ActionType {
  SetCustomResurrectionDate = "EMBALM_SET_CUSTOM_RESURRECTION_DATE",
  SetFile = "EMBALM_SET_FILE",
  SetRecipientState = "EMBALM_SET_RECIPIENT_STATE",
  SetResurrection = "EMBALM_SET_RESURRECTION",
  SetResurrectionRadioValue = "EMBALM_SET_RESURRECTION_RADIO_VALUE",
  SetOuterLayerKeys = "EMBALM_SET_OUTER_LAYER_KEYS",
  ResetEmbalmState = "EMBALM_RESET_EMBALM_STATE",
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
  sarcoId: string;
  publicKey: string;
  privateKey?: string;
  generatePDFState?: GeneratePDFState;
  pdfBlob?: Blob;
}

type EmbalmPayload = {
  [ActionType.SetCustomResurrectionDate]: { date: Date | null };
  [ActionType.SetFile]: { file: File };
  [ActionType.SetRecipientState]: RecipientState;
  [ActionType.SetResurrection]: { resurrection: number };
  [ActionType.SetResurrectionRadioValue]: { value: string };
  [ActionType.SetOuterLayerKeys]: { privateKey: string; publicKey: string };
  [ActionType.ResetEmbalmState]: {};
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

export function setRecipientState(recipientState: RecipientState): EmbalmActions {
  return {
    type: ActionType.SetRecipientState,
    payload: recipientState,
  };
}

export function setOuterLayerKeys(privateKey: string, publicKey: string): EmbalmActions {
  return {
    type: ActionType.SetOuterLayerKeys,
    payload: {
      privateKey,
      publicKey,
    },
  };
}

export function resetEmbalmState(): EmbalmActions {
  return {
    type: ActionType.ResetEmbalmState,
    payload: {},
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
