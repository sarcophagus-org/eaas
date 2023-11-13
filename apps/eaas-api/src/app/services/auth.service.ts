import bcrypt from "bcrypt";
import { tokenService, userService } from ".";
import { EaasUser } from "../../../src/types/EaasUser";
import { TokenObject, TokenType } from "../../../src/types/Token";
import { eaasKnex } from "../../../src/database";
import { JwtPayload } from "../../../src/types/JwtPayload";
import { apiErrors } from "../utils/errors";

/**
 * Log in the user with email and password
 *
 * @param email The user's email
 * @param password The user's password
 * @returns The user if login is sucessful, else null
 */
const loginWithEmailAndPassword = async (email: string, password: string): Promise<EaasUser> => {
  const [dbUser, hashedPassword] = await userService.getUserAndPasswordByEmail(email);

  if (!dbUser) {
    throw apiErrors.userNotFound;
  }

  if (await bcrypt.compare(password, hashedPassword)) {
    return dbUser;
  } else {
    throw apiErrors.incorrectPassword;
  }
};

/**
 * Logout the user given a token
 *
 * @param token The user's token
 */
const logout = async (token: string): Promise<void> => {
  const deletedToken = await eaasKnex("tokens")
    .where({ token, type: TokenType.refresh, blacklisted: false })
    .delete()
    .returning("*")
    .then((x) => x[0]);
  if (!deletedToken) {
    throw apiErrors.tokenNotFound;
  }
};

/**
 * Refreshes the user's tokens given the user's refresh token
 *
 * @param refreshToken The user's refresh token
 * @returns A token object
 */
const refreshAuth = async (refreshToken: string): Promise<TokenObject> => {
  const { sub: userId } = (await tokenService.consumeToken(refreshToken)) || ({} as JwtPayload);

  if (userId) {
    await userService.deleteTokensFromUser(userId);
    return tokenService.generateAuthTokens(userId);
  } else {
    throw apiErrors.noUserFoundOnToken;
  }
};

/**
 * Resets a user's password given the password reset token and a new password
 *
 * @param resetPasswordToken The reset password token
 * @param newPassword The new password
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  const { sub: userId } =
    (await tokenService.consumeToken(resetPasswordToken)) || ({} as JwtPayload);

  if (!userId) {
    throw apiErrors.invalidUserOnToken;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userService.updatePassword({ userId, hashedPassword });
};

/**
 * Verifies an email given the verifyEmailToken
 *
 * @param verifyEmailToken The verify email token
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  const { sub: userId } = (await tokenService.consumeToken(verifyEmailToken)) || ({} as JwtPayload);

  await userService.setEmailVerifiedStatus(userId, true);
};

export const authService = {
  loginWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
