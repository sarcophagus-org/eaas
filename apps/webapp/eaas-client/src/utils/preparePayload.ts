import { ethers } from "ethers";
import { Buffer } from "buffer";
import { sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { getArchConfig } from "api/embalm";

interface PreparePayloadArgs {
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
  const { file, recipientPublicKey } = args;

  const { privateKey: payloadPrivateKey, publicKey: payloadPublicKey } =
    ethers.Wallet.createRandom();

  let archConfig = await getArchConfig();

  const innerEncryptionData = await sarco.utils.encryptInnerLayer({
    file,
    recipientPublicKey,
    shares: archConfig.count,
    threshold: archConfig.threshold,
    payloadPrivateKey,
    payloadPublicKey,
    onStep: (_: any) => {},
  });

  return {
    ...innerEncryptionData,
    innerEncryptedkeyShares: innerEncryptionData.innerEncryptedkeyShares.map(Buffer.from),
    recipientPublicKey,
  };
};
