import { NodeSarcoClient } from "@sarcophagus-org/sarcophagus-v2-sdk";
import { envConfig } from "../../../src/config/env.config";
import { apiErrors } from "../utils/errors";
import { knex } from "../../../src/database";
import { EaasUser, UserType } from "../../../src/types/EaasUser";
import { SarcophagusDataWithClientEmail } from "../../../src/types/SarcophagusDataWithClientEmail";

async function getClientSarcophagi(user: EaasUser): Promise<SarcophagusDataWithClientEmail[]> {
  try {
    const sarco = new NodeSarcoClient({
      chainId: envConfig.chainId,
      privateKey: envConfig.privateKey,
      providerUrl: envConfig.providerUrl,
      zeroExApiKey: envConfig.zeroExApiKey,
    });

    const sarcoIdsWithEmails = await knex("created_sarcophagi")
      .where(user.type === UserType.client ? { client_id: user.id } : { embalmer_id: user.id })
      .join("users", "users.id", "=", "created_sarcophagi.client_id")
      .select("created_sarcophagi.id", "users.email")
      .then((rows) => rows);
    const sarcophagi = await sarco.api.getSarcophagiByIds(sarcoIdsWithEmails.map((x) => x["id"]));

    switch (user.type) {
      case UserType.client:
        return sarcophagi;

      case UserType.embalmer:
        const embalmerSarco: SarcophagusDataWithClientEmail[] = [];

        let i = 0;
        for (const s of sarcophagi) {
          const clientEmail = sarcoIdsWithEmails[i++]["email"] ?? "no client";

          if (clientEmail !== "no client") {
            embalmerSarco.push({ ...s, clientEmail });
          }
        }

        return embalmerSarco;
    }
  } catch (e) {
    console.log(e);
    throw apiErrors.fetchSarcophagiFailure;
  }
}

async function getSarcoClientEmail(sarcoId: string): Promise<string> {
  try {
    const clientEmail = await knex("created_sarcophagi")
      .where({ "created_sarcophagi.id": sarcoId })
      .innerJoin("users", "users.id", "=", "client_id")
      .select("*")
      .then((x) => (x[0] && x[0]["email"]) ?? "no client");

    return clientEmail;
  } catch (e) {
    console.log(e);
    throw apiErrors.fetchSarcoClientEmailFailure;
  }
}

async function rewrapSarcophagus(sarcoId: string, resurrectionTime: number): Promise<void> {
  try {
    const sarco = new NodeSarcoClient({
      chainId: envConfig.chainId,
      privateKey: envConfig.privateKey,
      providerUrl: envConfig.providerUrl,
    });

    await sarco.api.rewrapSarcophagus(sarcoId, resurrectionTime);
  } catch (e) {
    console.log(e);

    if (e.message.includes("ResurrectionTime")) {
      throw apiErrors.editSarcophagusError(e.errorName);
    }

    throw apiErrors.rewrapSarcophagusFailure;
  }
}

async function burySarcophagus(sarcoId: string): Promise<void> {
  try {
    const sarco = new NodeSarcoClient({
      chainId: envConfig.chainId,
      privateKey: envConfig.privateKey,
      providerUrl: envConfig.providerUrl,
    });

    await sarco.api.burySarcophagus(sarcoId);
  } catch (e) {
    console.log(e);

    if (e.message.includes("ResurrectionTime") || e.message.includes("SarcophagusInactive")) {
      throw apiErrors.editSarcophagusError(e.errorName);
    }

    throw apiErrors.burySarcophagusFailure;
  }
}

async function cleanSarcophagus(sarcoId: string): Promise<void> {
  try {
    const sarco = new NodeSarcoClient({
      chainId: envConfig.chainId,
      privateKey: envConfig.privateKey,
      providerUrl: envConfig.providerUrl,
    });

    await sarco.api.cleanSarcophagus(sarcoId);
  } catch (e) {
    console.log(e);

    if (
      e.message.includes("EmbalmerClaimWindowPassed") ||
      e.message.includes("TooEarlyForClean") ||
      e.message.includes("SarcophagusAlreadyCleaned")
    ) {
      throw apiErrors.editSarcophagusError(e.errorName);
    }

    throw apiErrors.cleanSarcophagusFailure;
  }
}

async function downloadRecipientPdf(args: { sarcoId: string; clientId: string }): Promise<string> {
  const { sarcoId, clientId } = args;

  let encryptedPdf: string;
  try {
    encryptedPdf = await knex("created_sarcophagi")
      .where({ id: sarcoId, client_id: clientId })
      .select("encrypted_pdf")
      .then((rows) => {
        const encryptedPdf = rows[0]["encrypted_pdf"] as string;
        return encryptedPdf;
      });
  } catch (e) {
    console.log(e);
    throw apiErrors.downloadRecipientPdfFailure;
  }

  if (!encryptedPdf || encryptedPdf.length === 0) {
    throw apiErrors.noRecipientPdf;
  }

  return encryptedPdf;
}

export const sarcophagiService = {
  getClientSarcophagi,
  getSarcoClientEmail,
  rewrapSarcophagus,
  cleanSarcophagus,
  burySarcophagus,
  downloadRecipientPdf,
};
