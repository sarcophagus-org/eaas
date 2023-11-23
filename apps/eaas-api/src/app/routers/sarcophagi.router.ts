import { Router } from "express";
import passport from "passport";
import { sarcophagiController } from "../controllers";

export const sarcophagiRoute = "/sarcophagi";
export const sarcophagiRouter = () => {
  const router = Router();

  router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    sarcophagiController.getClientSarcophagi,
  );

  return router;
};
