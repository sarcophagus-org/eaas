import { NodeSarcoClient } from "@sarcophagus-org/sarcophagus-v2-sdk";
import { PreparedEncryptedPayload } from "../../../src/types/embalmPayload";
import { envConfig } from "../../../src/config/env.config";
import { knex } from "../../../src/database";
import { loadArchaeologistAddressesFromFile } from "../utils/loadArchaeologists";

interface ArweaveUploadArgs {
  sarco: NodeSarcoClient;
  archaeologistPublicKeys: string[];
  preparedEncryptedPayload: PreparedEncryptedPayload;
}

interface EmbalmOptions {
  clientId: string;
  resurrectionTime: number;
  preparedEncryptedPayload: PreparedEncryptedPayload;
}

const uploadEncryptedPayloadToArweave = async (args: ArweaveUploadArgs) => {
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
      reject(error.message || "Error uploading payload to Bundlr");
    }
  });
};

async function runEmbalm(options: EmbalmOptions) {
  const { resurrectionTime, preparedEncryptedPayload, clientId } = options;

  const sarco = new NodeSarcoClient({
    chainId: envConfig.chainId,
    privateKey: envConfig.privateKey,
    providerUrl: envConfig.providerUrl,
    zeroExApiKey: envConfig.zeroExApiKey,
  });

  await sarco.init();

  const archaeologistsConfig = await loadArchaeologistAddressesFromFile();

  const selectedArchaeologists = await sarco.archaeologist
    .getFullArchProfiles({ filterOffline: false, addresses: archaeologistsConfig.addresses })
    .catch((error) => {
      console.error("Failed to get archaeologist profiles", error);
      throw error;
    });

  await Promise.all(
    selectedArchaeologists.map(async (arch) => {
      const connection = await sarco.archaeologist.dialArchaeologist(arch).catch((error) => {
        console.error(`Failed to dial archaeologist ${arch.profile.archAddress}`, error);
        throw error;
      });

      arch.connection = connection;
    }),
  ).catch((error) => {
    console.error("Failed to dial archaeologists", error);
    throw error;
  });

  const archaeologistPublicKeys = new Map<string, string>();
  const archaeologistSignatures = new Map<string, string>();

  try {
    const [negotiationResult, negotiationTimestamp] =
      await sarco.archaeologist.initiateSarcophagusNegotiation(selectedArchaeologists);

    selectedArchaeologists.forEach((arch) => {
      const res = negotiationResult.get(arch.profile.peerId)!;
      if (res.exception) {
        // TODO: handle this more gracefully
        console.log("arch exception:", arch.profile.archAddress, res.exception);
        // Sentry.captureException(res.exception);
      } else {
        archaeologistPublicKeys.set(arch.profile.archAddress, res.publicKey!);
        archaeologistSignatures.set(arch.profile.archAddress, res.signature!);
      }
    });

    if (archaeologistPublicKeys.size !== selectedArchaeologists.length) {
      throw Error("Not enough public keys");
    }

    if (archaeologistSignatures.size !== selectedArchaeologists.length) {
      throw Error("Not enough signatures");
    }

    const sarcophagusPayloadTxId = await uploadEncryptedPayloadToArweave({
      archaeologistPublicKeys: Array.from(archaeologistPublicKeys.values()),
      sarco,
      preparedEncryptedPayload,
    });

    const { submitSarcophagusArgs } = sarco.utils.formatSubmitSarcophagusArgs({
      name: `${preparedEncryptedPayload.encryptedPayloadMetadata.fileName}-${Date.now()}`,
      recipientPublicKey: preparedEncryptedPayload.recipientPublicKey,
      resurrection: resurrectionTime,
      selectedArchaeologists,
      requiredArchaeologists: archaeologistsConfig.requiredArchaeologists,
      negotiationTimestamp,
      archaeologistPublicKeys,
      archaeologistSignatures,
      arweaveTxId: sarcophagusPayloadTxId,
    });

    await sarco.api.createSarcophagus(...submitSarcophagusArgs);

    const { embalmer_id } = await knex("embalmer_has_clients")
      .where({ client_id: clientId })
      .select("embalmer_id")
      .then((x) => x[0]);

    await knex("created_sarcophagi").insert({
      id: submitSarcophagusArgs[0],
      client_id: clientId,
      embalmer_id,
    });
  } catch (e) {
    //   const errorMsg = handleRpcError(e);
    //   Sentry.captureException(errorMsg, { fingerprint: ['CREATE_SARCOPHAGUS_FAILURE'] });
    // TODO: handle errors here more gracefully, perhaps in a more granular fashion
    throw new Error(e);
  }
}

let cachedPreparePayloadArchConfig:
  | {
      count: number;
      threshold: number;
    }
  | undefined;

async function getArchaeologistConfig() {
  if (cachedPreparePayloadArchConfig === undefined) {
    const archaeologistsConfig = await loadArchaeologistAddressesFromFile();
    cachedPreparePayloadArchConfig = {
      count: archaeologistsConfig.addresses.length,
      threshold: archaeologistsConfig.requiredArchaeologists,
    };
  }

  return cachedPreparePayloadArchConfig;
}

export const embalmService = {
  runEmbalm,
  getArchaeologistConfig,
};
