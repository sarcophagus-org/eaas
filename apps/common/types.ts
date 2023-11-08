interface PayloadMetadata {
  fileName: string;
  type: string;
}

export interface PreparedEncryptedPayload {
  encryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
  encryptedPayload:  Buffer | { type: string; data: Buffer };
  innerEncryptedkeyShares: Buffer[] | { type: string; data: Buffer }[];
};

export interface SendEncryptedPayloadParams {
  preparedEncryptedPayload: PreparedEncryptedPayload;
  chainId: number;
  threshold: number;
  resurrectionTime: number;
  sarcophagusName: string;
}
