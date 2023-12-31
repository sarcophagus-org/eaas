import { Request, Response } from "express";
import { authService, tokenService, userService } from "../services";
import { envConfig } from "../../../src/config/env.config";

import { emailService } from "../services/email.service";
import { EaasUser, RequestWithUser } from "src/types/EaasUser";

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  await tokenService.verifyToken(token, envConfig.jwt.secret);
  res.status(200).json();
};

const register = async (req: Request, res: Response) => {
  const { user, inviteToken } = req.body;
  const { password } = user;
  const { user: dbUser } = await userService.createUserWithInvite({
    password,
    inviteToken,
  });

  const tokens = await tokenService.generateAuthTokens(dbUser.id);
  res.status(201).json({
    user: dbUser,
    tokens,
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.loginWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user.id);

  res.status(200).json({ user, tokens });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  res.status(204).send();
};

const refreshTokens = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  res.status(200).json(tokens);
};

const resetPassword = async (req: Request, res: Response) => {
  const { password, token } = req.body;
  await authService.resetPassword(token.toString(), password);
  res.status(204).send();
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(204).send();
};

const sendVerificationEmail = async (req: RequestWithUser, res: Response) => {
  const user = req.user as EaasUser;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user.id);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(204).send();
};

const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    res.status(400).send();
  }
  await authService.verifyEmail(token);
  res.status(204).send();
};

export const authController = {
  verifyToken,
  register,
  login,
  logout,
  refreshTokens,
  resetPassword,
  forgotPassword,
  sendVerificationEmail,
  verifyEmail,
};
