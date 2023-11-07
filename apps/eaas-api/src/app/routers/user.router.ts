import { Router } from "express";
import passport from "passport";
import { userController } from "../controllers/user.controller";

export const userRouter = () => {
  const router = Router();

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
