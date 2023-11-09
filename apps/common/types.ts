interface PayloadMetadata {
  fileName: string;
  type: string;
}

export interface ApiBufferType {
  type: string;
  data: Buffer;
}

export interface PreparedEncryptedPayload {
  encryptedPayloadMetadata: PayloadMetadata;
  recipientPublicKey: string;
  encryptedPayload: Buffer | ApiBufferType;
  innerEncryptedkeyShares: Buffer[] | ApiBufferType[];
}

export interface SendEncryptedPayloadParams {
  preparedEncryptedPayload: PreparedEncryptedPayload;
  chainId: number;
  threshold: number;
  resurrectionTime: number;
  sarcophagusName: string;
}
