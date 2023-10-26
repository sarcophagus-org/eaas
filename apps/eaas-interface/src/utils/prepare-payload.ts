import { encrypt } from "ecies-geth";
import { ethers } from "ethers";
import { split } from "shamirs-secret-sharing-ts";
import { readFileDataAsBase64 } from "@sarcophagus-org/sarcophagus-v2-sdk";
import { PreparedEncryptedPayload } from "../../../common/types";

interface PreparePayloadArgs {
  nArchs: number;
  file: File;
  recipientPublicKey: string;
}

/**
 * Prepare the payload for upload to the Embalmer-X Server.
 */
export const preparePayload = async (
  args: PreparePayloadArgs,
): Promise<PreparedEncryptedPayload> => {
  const { nArchs, file, recipientPublicKey } = args;

  const randomWallet = ethers.Wallet.createRandom();

  const { data, type } = await readFileDataAsBase64(file!);

  const preEncryptedPayloadMetadata = {
    fileName: file.name,
    type,
  };

  const preEncryptedPayload = await encrypt(
    Buffer.from(ethers.utils.arrayify(randomWallet.publicKey)),
    data,
  );

  const keyShares: Uint8Array[] = split(randomWallet.privateKey!, {
    shares: nArchs,
    threshold: nArchs,
  });

  const recipientInnerEncryptedkeyShares = await Promise.all(
    keyShares.map(async (keyShare) => {
      return encrypt(Buffer.from(recipientPublicKey), Buffer.from(keyShare));
    }),
  );

  return {
    preEncryptedPayload,
    recipientInnerEncryptedkeyShares,
    preEncryptedPayloadMetadata,
    recipientPublicKey,
  };
};
