interface PayloadMetadata {
  fileName: string;
  type: string;
}

export interface PreparedEncryptedPayload {
  preEncryptedPayload: Buffer;
  recipientInnerEncryptedkeyShares: Uint8Array[];
  preEncryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
}

export interface PreparedEncryptedPayloadApiBody {
  preEncryptedPayload: { type: string; data: Buffer };
  recipientInnerEncryptedkeyShares: { type: string; data: Buffer }[];
  preEncryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
}

export interface SendEncryptedPayloadParams {
  preparedEncryptedPayload: PreparedEncryptedPayloadApiBody;
  chainId: number;
  threshold: number;
  resurrectionTime: number;
  sarcophagusName: string;
}
