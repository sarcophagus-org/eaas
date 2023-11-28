import { Router } from "express";
import passport from "passport";
import { sarcophagiController } from "../controllers";
import { getUserTypeValidator, validateRequestBody } from "../middleware";
import { UserType } from "../../../src/types/EaasUser";
import { rewrapSarcophagusSchema } from "../validationSchemas";

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

  router.post(
    "/rewrap",
    passport.authenticate("jwt", { session: false }),
    getUserTypeValidator(UserType.client),
    validateRequestBody(rewrapSarcophagusSchema),
    sarcophagiController.rewrapSarcophagus,
  );

  return router;
};
