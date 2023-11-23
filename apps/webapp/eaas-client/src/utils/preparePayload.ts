import { encrypt } from "ecies-geth";
import { ethers } from "ethers";
import { split } from "shamirs-secret-sharing-ts";
import { Buffer } from "buffer";

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
 * Returns base64 data of a given File object
 * @param file The File object
 * @returns Object with params:
 *
 *  - `type` - file type descriptor string formatted as `"data:<file-type>/<file-ext>;base64"`
 *
 *  - `data` - file data formatted as a base64 string
 */
function readFileDataAsBase64(file: File): Promise<{ type: string; data: Buffer }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      // format of `res` is:
      // "data:image/png;base64,iVBORw0KGg..."
      const res = event.target?.result as string;
      if (!res.startsWith("data:")) {
        reject("There was a problem reading the file");
      }

      const i = res.indexOf(",");

      resolve({
        type: res.slice(0, i),
        data: Buffer.from(res.slice(i + 1), "base64"),
      });
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Prepare the payload for upload to the Embalmer-X Server.
 */
export const preparePayload = async (args: PreparePayloadArgs): Promise<PreparePayloadResult> => {
  const { nArchs, file, recipientPublicKey } = args;

  const { privateKey: payloadPrivateKey, publicKey: payloadPublicKey } =
    ethers.Wallet.createRandom();

  const { data, type } = await readFileDataAsBase64(file!);

  const encryptedPayloadMetadata = {
    fileName: file.name,
    type,
  };

  const encryptedPayload = await encrypt(
    Buffer.from(ethers.utils.arrayify(payloadPublicKey)),
    data,
  );

  const keyShares: Uint8Array[] = split(payloadPrivateKey, {
    shares: nArchs,
    threshold: nArchs,
  });

  const innerEncryptedkeyShares = await Promise.all(
    keyShares.map(async (keyShare) => {
      return await encrypt(
        Buffer.from(ethers.utils.arrayify(recipientPublicKey)),
        Buffer.from(keyShare),
      );
    }),
  );

  // TODO: Uncomment and use this instead when updated sdk is published
  // const innerEncryptionData = sarco.utils.encryptInnerLayer({
  //   file,
  //   recipientPublicKey,
  //   shares: nArchs,
  //   threshold: nArchs,
  //   payloadPrivateKey: randomWallet.privateKey,
  //   payloadPublicKey: randomWallet.publicKey,
  // });

  // return {
  //   ...innerEncryptionData,
  //   recipientPublicKey,
  // };

  return {
    encryptedPayload,
    innerEncryptedkeyShares,
    encryptedPayloadMetadata,
    recipientPublicKey,
  };
};
