interface PayloadMetadata {
  fileName: string;
  type: string;
}

export interface PreparedEncryptedPayload {
  encryptedPayload: Buffer;
  innerEncryptedkeyShares: Uint8Array[];
  encryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
}

export type PreparedEncryptedPayloadApiBody = Pick<PreparedEncryptedPayload, 'recipientPublicKey' | 'encryptedPayloadMetadata'> & {
  encryptedPayload: { type: string; data: Buffer };
  innerEncryptedkeyShares: { type: string; data: Buffer }[];
}

export interface SendEncryptedPayloadParams {
  preparedEncryptedPayload: PreparedEncryptedPayloadApiBody;
  chainId: number;
  threshold: number;
  resurrectionTime: number;
  sarcophagusName: string;
}
