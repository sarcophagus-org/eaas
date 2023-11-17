import { Router } from "express";
import passport from "passport";
import { embalmController } from "../controllers";
import { validateRequestBody } from "../middleware";
import { sendEncryptedPayloadSchema } from "../validationSchemas";
import { parsePreparedEncryptedPayloadForm } from "../utils/parseForm";

export const embalmRoute = "/embalm";
export const embalmRouter = () => {
  const router = Router();

  router.post(
    "/send-payload",
    passport.authenticate("jwt", { session: false }),
    parsePreparedEncryptedPayloadForm,
    validateRequestBody(sendEncryptedPayloadSchema),
    embalmController.runEmbalm,
  );

  return router;
};
