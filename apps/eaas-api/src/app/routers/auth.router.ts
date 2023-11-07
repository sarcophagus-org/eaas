import { Router } from "express";
import { authController } from "../controllers";
// import { validate } from "../middleware/validate";

export const authRouter = () => {
  const router = Router();

  router.get("/verify-token", authController.verifyToken);
  router.post("/login", authController.login);
  router.post("/logout", authController.logout);
  router.post("/refresh-tokens", authController.refreshTokens);
  router.post(
    "/reset-password",
    // validate(resetPasswordSchema),
    authController.resetPassword,
  );
  // router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
  router.post("/verify-email", authController.verifyEmail);
  // router.post(
  //   "/send-verification-email",
  //   passport.authenticate("jwt", { session: false }),
  //   sendVerificationEmail,
  // );

  return router;
};
