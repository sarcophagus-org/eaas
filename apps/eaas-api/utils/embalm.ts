import { ArchaeologistExceptionCode, NodeSarcoClient } from "@sarcophagus-org/sarcophagus-v2-sdk";
import { uploadEncryptedPayloadToArweave } from "./arweave";
import { PreparedEncryptedPayload } from "../../../packages/types";

export interface EmbalmOptions {
  chainId: number;
  sarcophagusName: string;
  resurrectionTime: number;
  totalArchaeologists: number;
  requiredArchaeologists: number;
  preparedEncryptedPayload: PreparedEncryptedPayload;
}

export async function runEmbalm(options: EmbalmOptions) {
  const {
    chainId,
    sarcophagusName,
    resurrectionTime,
    preparedEncryptedPayload,
    requiredArchaeologists,
  } = options;

  const sarco = new NodeSarcoClient({
    chainId,
    privateKey: process.env.PRIVATE_KEY!,
    providerUrl: process.env.PROVIDER_URL!,
    zeroExApiKey: process.env.ZERO_EX_API_KEY!,
  });

  sarco.init();

  const allArchaeologists = await sarco.archaeologist
    .getFullArchProfiles({ filterOffline: true })
    .catch((error) => {
      console.error("Failed to get archaeologist profiles");
      throw error;
    });

  const nArchs = 1;

  // TODO: select archaeologists
  // Possible logic: randomly select` nArchs * 2` archaeologists.
  // Select `nArchs` of these with the lowest fees and attempt to negotiate with them.
  // Replace unreachable archaeologists with the next lowest fee archaeologist in unselected backup list.
  const selectedArchaeologists = allArchaeologists.slice(0, nArchs);

  await Promise.all(
    selectedArchaeologists.map(async (arch) => {
      const connection = await sarco.archaeologist.dialArchaeologist(arch).catch((error) => {
        console.error(`Failed to dial archaeologist ${arch.profile.archAddress}`);
        throw error;
      });

      arch.connection = connection;
    }),
  ).catch((error) => {
    console.error("Failed to dial archaeologists");
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
      nShares: selectedArchaeologists.length,
      sarco,
      threshold: requiredArchaeologists,
      preparedEncryptedPayload,
    });

    const { submitSarcophagusArgs } = sarco.utils.formatSubmitSarcophagusArgs({
      name: sarcophagusName,
      recipientPublicKey: preparedEncryptedPayload.recipientPublicKey,
      resurrection: resurrectionTime,
      selectedArchaeologists,
      requiredArchaeologists,
      negotiationTimestamp,
      archaeologistPublicKeys,
      archaeologistSignatures,
      arweaveTxId: sarcophagusPayloadTxId,
    });

    ArchaeologistExceptionCode;
    const tx = await sarco.api.createSarcophagus(...submitSarcophagusArgs);
    await tx.wait();
  } catch (e) {
    //   const errorMsg = handleRpcError(e);
    //   Sentry.captureException(errorMsg, { fingerprint: ['CREATE_SARCOPHAGUS_FAILURE'] });
    throw new Error(e);
  }
}