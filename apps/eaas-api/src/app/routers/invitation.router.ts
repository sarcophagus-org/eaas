import { Router } from "express";
import passport from "passport";
import { invitationController } from "../controllers";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { createInvitationSchema } from "../validationSchemas";

export const invitationRouter = () => {
  const router = Router();

  router.get(
    "/sent",
    passport.authenticate("jwt", { session: false }),
    invitationController.getSenderInvitations,
  );
  router.post(
    "/create",
    validateRequestBody(createInvitationSchema),
    passport.authenticate("jwt", { session: false }),
    invitationController.createInvitation,
  );
  router.post("/validate", invitationController.validateInviteToken);
  router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    invitationController.deleteInvitation,
  );

  return router;
};
