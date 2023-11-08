import { Router } from "express";
import passport from "passport";
import { userController } from "../controllers/user.controller";
import { createUserSchema } from "../validationSchemas";
import { validateRequestBody } from "../middleware/validateRequestBody";

export const userRouter = () => {
  const router = Router();

  router.post(
    "/register",
    validateRequestBody(createUserSchema),
    userController.createUserWithInvite,
  );

  router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    userController.getCurrentUser,
  );

  router.get("/all", passport.authenticate("jwt", { session: false }), userController.getAllUsers);

  router.get("/:userId", userController.getUser);

  router.put("/", passport.authenticate("jwt", { session: false }), userController.updateUser);

  return router;
};
