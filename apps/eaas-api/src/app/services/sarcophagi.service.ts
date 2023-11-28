import { NodeSarcoClient, SarcophagusData } from "@sarcophagus-org/sarcophagus-v2-sdk";
import { envConfig } from "../../../src/config/env.config";
import { apiErrors } from "../utils/errors";
import { knex } from "../../../src/database";

async function getClientSarcophagi(userId: string): Promise<SarcophagusData[]> {
  const sarco = new NodeSarcoClient({
    chainId: envConfig.chainId,
    privateKey: envConfig.privateKey,
    providerUrl: envConfig.providerUrl,
    zeroExApiKey: envConfig.zeroExApiKey,
  });

  try {
    const sarcoIds = await knex("created_sarcophagi")
      .where({ client_id: userId })
      .select("id")
      .then((rows) => rows.map((x) => x["id"]));

    const sarcophagi = sarco.api.getSarcophagiByIds(sarcoIds);
    return sarcophagi;
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
      throw apiErrors.rewrapSarcophagusResurrectionTimeError(e.message);
    }

    throw apiErrors.rewrapSarcophagusFailure;
  }
}

export const sarcophagiService = {
  getClientSarcophagi,
  getSarcoClientEmail,
  rewrapSarcophagus,
};
