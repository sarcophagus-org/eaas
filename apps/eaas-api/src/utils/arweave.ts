import { NodeSarcoClient } from "@sarcophagus-org/sarcophagus-v2-sdk";
import { PreparedEncryptedPayload } from "../../../common/types";

export interface ArweaveUploadArgs {
  sarco: NodeSarcoClient;
  nShares: number;
  threshold: number;
  archaeologistPublicKeys: string[];
  preparedEncryptedPayload: PreparedEncryptedPayload;
}

export const uploadEncryptedPayloadToArweave = async (args: ArweaveUploadArgs) => {
  const { sarco, archaeologistPublicKeys, nShares, threshold } = args;

  const {
    recipientPublicKey,
    preEncryptedPayload,
    recipientInnerEncryptedkeyShares,
    preEncryptedPayloadMetadata,
  } = args.preparedEncryptedPayload;

  return new Promise<string>(async (resolve, reject) => {
    try {
      const uploadPromise = sarco.api.uploadFileToArweave({
        archaeologistPublicKeys,
        onStep: (step: string) => console.log(`Uploading To Arweave: ${step}`),
        recipientPublicKey,
        shares: nShares,
        threshold,
        onUploadChunk: (chunkedUploader: any, chunkedUploadProgress: number) => {
          console.log(`Upload Progress: ${chunkedUploadProgress}%`);
        },
        onUploadChunkError: (msg: string) => {
          console.error(msg);
          throw new Error(msg);
        },
        onUploadComplete: (uploadId: string) => resolve(uploadId),
        preEncryptedPayload,
        recipientInnerEncryptedkeyShares,
        preEncryptedPayloadMetadata,
      });

      await uploadPromise;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Error uploading payload to Bundlr");
    }
  });
};
