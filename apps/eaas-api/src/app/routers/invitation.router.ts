import { Router } from "express";
import passport from "passport";
import { invitationController } from "../controllers";

export const invitationRouter = () => {
  const router = Router();

  router.get(
    "/sent",
    passport.authenticate("jwt", { session: false }),
    invitationController.getSenderInvitations,
  );
  router.post(
    "/create",
    // validate(createInvitationSchema),
    passport.authenticate("jwt", { session: false }),
    invitationController.createInvitation,
  );
  router.post("/accept", invitationController.acceptInvite);
  router.post("/validate", invitationController.validateInviteToken);
  router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    invitationController.deleteInvitation,
  );

  return router;
};
