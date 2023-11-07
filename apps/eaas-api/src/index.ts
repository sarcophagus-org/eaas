import { Request, Response } from "express";
import { logging } from "./utils/logger";
import { SendEncryptedPayloadParams } from "../../common/types";
import { formatPreparedEncryptedPayload, runEmbalm } from "./utils/embalm";
import { initialiseApp, setupRoutes, startApp } from "./app";

const app = initialiseApp();
setupRoutes(app);

app.post("/send-payload", async (req: Request, res: Response) => {
  try {
    const { preparedEncryptedPayload, threshold, resurrectionTime, sarcophagusName, chainId } =
      req.body as SendEncryptedPayloadParams;

    // TODO: Add client user auth. Obtain user info Request.
    // TODO: Validate params?

    await runEmbalm({
      chainId,
      preparedEncryptedPayload: formatPreparedEncryptedPayload(preparedEncryptedPayload),
      requiredArchaeologists: threshold,
      resurrectionTime,
      sarcophagusName,
    });

    res.status(200).send("Success");
  } catch (e) {
    logging.error(e);
    res.status(500).send({ error: "There was a problem processing your request" });
  }
});

startApp({ app });
