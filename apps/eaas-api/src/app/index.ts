import express from "express";
import cors from "cors";
import { logging } from "../../src/utils/logger";
import { Router, Request, Response, Express } from "express";
import { validateEnvVars } from "../utils/validate-env";
import { UNCAUGHT_EXCEPTION } from "../../src/utils/exit-codes";
import { envConfig } from "../config/env.config";
import { userRouter } from "./routers/user.router";
import { authRouter, invitationRouter } from "./routers";

export function initialiseApp() {
  const app = express();

  // app.use(
  //   cors({
  //     origin: envConfig.client.url,
  //     credentials: false,
  //   }),
  // );
  app.use(cors());
  app.use(express.json());

  return app;
}

export function startApp(params: { app: express.Express; port?: number }) {
  const { app, port } = params;
  const _port = port ?? 4000;

  app.listen(_port, async () => {
    logging.debug("App start");
    validateEnvVars();

    [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach(
      (eventType) => {
        process.on(eventType, async (e) => {
          logging.info(`Received exit event: ${eventType}`);
          !!e && console.error(e);
          process.exit(UNCAUGHT_EXCEPTION);
        });
      },
    );
  });
}

export function setupRoutes(app: Express) {
  const rootRouter = Router();
  rootRouter.get("/", (req: Request, res: Response) => res.send("Embalmer-X online!"));
  app.use(rootRouter);

  app.use("/user", userRouter());
  app.use("/auth", authRouter());
  app.use("/invitation", invitationRouter());
}