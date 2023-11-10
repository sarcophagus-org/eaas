import { Router } from "express";
import passport from "passport";
import { embalmController } from "../controllers";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { sendEncryptedPayloadSchema } from "../validationSchemas";

export const embalmRouter = () => {
  const router = Router();

  router.post(
    "/send-payload",
    passport.authenticate("jwt", { session: false }),
    validateRequestBody(sendEncryptedPayloadSchema),
    embalmController.sendEncryptedPayload,
  );

  return router;
};
