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

export const sarcophagiService = {
  getClientSarcophagi,
};
