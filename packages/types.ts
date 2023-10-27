interface PayloadMetadata {
  fileName: string;
  type: string;
}

export interface PreparedEncryptedPayload {
  preEncryptedPayload: Buffer;
  recipientInnerEncryptedkeyShares: Buffer[];
  preEncryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
}

export interface SendEncryptedPayloadParams {
  preparedEncryptedPayload: PreparedEncryptedPayload;
  chainId: number;
  threshold: number;
  resurrectionTime: number;
  sarcophagusName: string;
}
