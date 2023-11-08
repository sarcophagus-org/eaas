import { NodeSarcoClient } from "@sarcophagus-org/sarcophagus-v2-sdk";
import { PreparedEncryptedPayload } from "../../../common/types";

export interface ArweaveUploadArgs {
  sarco: NodeSarcoClient;
  archaeologistPublicKeys: string[];
  preparedEncryptedPayload: PreparedEncryptedPayload;
}

export const uploadEncryptedPayloadToArweave = async (args: ArweaveUploadArgs) => {
  const { sarco, archaeologistPublicKeys } = args;

  const {
    recipientPublicKey,
    encryptedPayload,
    innerEncryptedkeyShares,
    encryptedPayloadMetadata,
  } = args.preparedEncryptedPayload;

  return new Promise<string>(async (resolve, reject) => {
    try {
      const uploadPromise = sarco.api.uploadPreEncryptedPayloadToArweave({
        archaeologistPublicKeys,
        onStep: (step: string) => console.log(`Uploading To Arweave: ${step}`),
        recipientPublicKey,
        onUploadChunk: (_: any, chunkedUploadProgress: number) => {
          console.log(`Upload Progress: ${chunkedUploadProgress}%`);
        },
        onUploadChunkError: (msg: string) => {
          console.error(msg);
          throw new Error(msg);
        },
        onUploadComplete: (uploadId: string) => resolve(uploadId),
        encryptedPayload: encryptedPayload as Buffer,
        innerEncryptedkeyShares: innerEncryptedkeyShares as Buffer[],
        encryptedPayloadMetadata,
      });

      await uploadPromise;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Error uploading payload to Bundlr");
    }
  });
};
