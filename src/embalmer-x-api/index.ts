import express, { Request, Response } from "express";
import cors from "cors";
import { validateEnvVars } from "./utils/validate-env";
import { logging } from "./utils/logger";
import { UNCAUGHT_EXCEPTION } from "./utils/exit-codes";
import { SendEncryptedPayloadParams } from "../common/types";
import { runEmbalm } from "./utils/embalm";

const app = express();
const port = 4000;

const whitelistedDomains = ["https://app.dev.embalmer-x.io", "https://app.embalmer-x.io"];

const corsOptions = {
  origin: function (origin, callback) {
    if (origin && whitelistedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Embalmer-X online");
});

app.post("/send-payload", async (req: Request, res: Response) => {
  try {
    const { preparedEncryptedPayload, nArchs, threshold, resurrectionTime, sarcophagusName } =
      req.body as SendEncryptedPayloadParams;

    // TODO: Add client user auth. Obtain user info Request.
    // TODO: Validate params?

    await runEmbalm({
      chainId: 1,
      preparedEncryptedPayload,
      totalArchaeologists: nArchs,
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

app.listen(port, async () => {
  logging.debug("App start");
  validateEnvVars();

  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, async (e) => {
      logging.info(`Received exit event: ${eventType}`);
      !!e && console.error(e);
      process.exit(UNCAUGHT_EXCEPTION);
    });
  });
});
