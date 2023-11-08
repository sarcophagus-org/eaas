interface PayloadMetadata {
  fileName: string;
  type: string;
}

export interface PreparedEncryptedPayload {
  preEncryptedPayload: Buffer;
  innerEncryptedkeyShares: Uint8Array[];
  preEncryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
}

export type PreparedEncryptedPayloadApiBody = Pick<PreparedEncryptedPayload, 'recipientPublicKey' | 'preEncryptedPayloadMetadata'> & {
  preEncryptedPayload: { type: string; data: Buffer };
  recipientInnerEncryptedkeyShares: { type: string; data: Buffer }[];
}

export interface SendEncryptedPayloadParams {
  preparedEncryptedPayload: PreparedEncryptedPayloadApiBody;
  chainId: number;
  threshold: number;
  resurrectionTime: number;
  sarcophagusName: string;
}
