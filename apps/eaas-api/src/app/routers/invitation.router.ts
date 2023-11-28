import { Router } from "express";
import passport from "passport";
import { invitationController } from "../controllers";
import { validateRequestBody } from "../middleware";
import { createInvitationSchema } from "../validationSchemas";
import { getUserTypeValidator } from "../middleware/userTypeValidator";
import { UserType } from "../../../src/types/EaasUser";

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
    getUserTypeValidator(UserType.embalmer),
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
