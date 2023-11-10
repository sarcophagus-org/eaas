import express from "express";
import cors from "cors";
import passport from "passport";
import { logging } from "../../src/utils/logger";
import { Router, Request, Response, Express } from "express";
import { UNCAUGHT_EXCEPTION } from "../../src/utils/exit-codes";
import { userRouter } from "./routers/user.router";
import { authRouter, embalmRouter, invitationRouter, jwtStrategy } from "./routers";

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
  app.use(passport.initialize());
  passport.use("jwt", jwtStrategy);

  return app;
}

export function startApp(params: { app: express.Express; port?: number }) {
  const { app, port } = params;
  const _port = port ?? 4000;

  app.listen(_port, async () => {
    logging.debug("App start");

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
  rootRouter.get("/", (_, res: Response) => res.send("Embalmer-X online!"));
  app.use(rootRouter);

  app.use("/user", userRouter());
  app.use("/auth", authRouter());
  app.use("/invitation", invitationRouter());
  app.use("/embalm", embalmRouter());
}
