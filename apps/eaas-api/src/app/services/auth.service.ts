import bcrypt from "bcrypt";
import { tokenService, userService } from ".";
import { EaasUser } from "../../../src/types/EaasUser";
import { TokenObject, TokenType } from "../../../src/types/Token";
import { eaasKnex } from "../../../src/database";
import { JwtPayload } from "../../../src/types/JwtPayload";

/**
 * Log in the user with email and password
 *
 * @param email The user's email
 * @param password The user's password
 * @returns The user if login is sucessful, else null
 */
const loginWithEmailAndPassword = async (email: string, password: string): Promise<EaasUser> => {
  const dbUser = await userService.getUserByEmail(email);

  if (!dbUser) {
    throw new Error("no user found with that email");
  }

  if (await bcrypt.compare(password, dbUser.password)) {
    return dbUser;
  } else {
    throw new Error("incorrect password");
  }
};

/**
 * Logout the user given a token
 *
 * @param token The user's token
 */
const logout = async (token: string): Promise<void> => {
  try {
    const deletedToken = await eaasKnex("tokens")
      .where({ token, type: TokenType.Refresh, blacklisted: false })
      .delete()
      .returning("*")
      .then((x) => x[0]);
    if (!deletedToken) {
      throw new Error("token not found");
    }
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Refreshes the user's tokens given the user's refresh token
 *
 * @param refreshToken The user's refresh token
 * @returns A token object
 */
const refreshAuth = async (refreshToken: string): Promise<TokenObject> => {
  try {
    const { sub: userId } = (await tokenService.consumeToken(refreshToken)) || ({} as JwtPayload);

    if (userId) {
      await userService.deleteTokensFromUser(userId);
      return tokenService.generateAuthTokens(userId);
    } else {
      throw new Error("no user found on token");
    }
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Resets a user's password given the password reset token and a new password
 *
 * @param resetPasswordToken The reset password token
 * @param newPassword The new password
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const { sub: userId } =
      (await tokenService.consumeToken(resetPasswordToken)) || ({} as JwtPayload);

    if (!userId) throw new Error("user on token invalid");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword({ userId, hashedPassword });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Verifies an email given the verifyEmailToken
 *
 * @param verifyEmailToken The verify email token
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const { sub: userId } =
      (await tokenService.consumeToken(verifyEmailToken)) || ({} as JwtPayload);

    await userService.setEmailVerifiedStatus(userId, true);
  } catch (error) {
    throw new Error(error);
  }
};

export const authService = {
  loginWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
