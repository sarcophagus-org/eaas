import { ethers } from "ethers";
import { Buffer } from "buffer";
import { sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

interface PreparePayloadArgs {
  nArchs: number;
  file: File;
  recipientPublicKey: string;
}

interface PreparePayloadResult {
  encryptedPayload: Buffer;
  innerEncryptedkeyShares: Buffer[];
  encryptedPayloadMetadata: {
    fileName: string;
    type: string;
  };
  recipientPublicKey: string;
}

/**
 * Prepare the payload for upload to the Embalmer-X Server.
 */
export const preparePayload = async (args: PreparePayloadArgs): Promise<PreparePayloadResult> => {
  const { nArchs, file, recipientPublicKey } = args;

  const { privateKey: payloadPrivateKey, publicKey: payloadPublicKey } =
    ethers.Wallet.createRandom();

  const innerEncryptionData = await sarco.utils.encryptInnerLayer({
    file,
    recipientPublicKey,
    shares: nArchs,
    threshold: nArchs,
    payloadPrivateKey,
    payloadPublicKey,
    onStep: (step: string) => {},
  });

  return {
    ...innerEncryptionData,
    innerEncryptedkeyShares: innerEncryptionData.innerEncryptedkeyShares.map((share) => Buffer.from(share)),
    recipientPublicKey,
  };
};
