import { Router } from "express";
import passport from "passport";
import { invitationController } from "../controllers";
import { authorizeInvitationSender, validateRequestBody } from "../middleware";
import { createInvitationSchema } from "../validationSchemas";

export const invitationRoute = "/invitation";
export const invitationRouter = () => {
  const router = Router();

  router.get(
    "/sent",
    passport.authenticate("jwt", { session: false }),
    invitationController.getSenderInvitations,
  );
  router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    validateRequestBody(createInvitationSchema),
    authorizeInvitationSender,
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
