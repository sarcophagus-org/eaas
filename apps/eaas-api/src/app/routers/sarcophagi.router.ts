import { Router } from "express";
import passport from "passport";
import { sarcophagiController } from "../controllers";
import { getUserTypeValidator } from "../middleware";
import { UserType } from "../../../src/types/EaasUser";

export const sarcophagiRoute = "/sarcophagi";
export const sarcophagiRouter = () => {
  const router = Router();

  router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    sarcophagiController.getClientSarcophagi,
  );

  router.get(
    "/:sarcoId/client-email",
    passport.authenticate("jwt", { session: false }),
    getUserTypeValidator(UserType.embalmer),
    sarcophagiController.getSarcoClientEmail,
  );

  return router;
};
