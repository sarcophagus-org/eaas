interface PayloadMetadata {
  fileName: string;
  type: string;
}
export interface PreparedEncryptedPayload {
  encryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
  encryptedPayload: Buffer;
  innerEncryptedkeyShares: Buffer[];
}

export interface SendEncryptedPayloadParams {
  preparedEncryptedPayload: PreparedEncryptedPayload;
  resurrectionTime: number;
}
