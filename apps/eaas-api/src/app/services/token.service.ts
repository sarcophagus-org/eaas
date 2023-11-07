import jwt, { Secret } from "jsonwebtoken";
import moment, { Moment } from "moment";
import { eaasKnex } from "../../database";
import { envConfig } from "src/config/env.config";
import { AuthTokenTypes, TokenObject, TokenType } from "src/types/Token";
import { userService } from "./user.service";
import { JwtPayload } from "src/types/JwtPayload";

/**
 * Generate auth tokens
 *
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (userId: string): Promise<TokenObject> => {
  try {
    const accessTokenExpires = moment().add(envConfig.jwt.accessExpirationDays, "days");

    const refreshTokenExpires = moment().add(envConfig.jwt.refreshExpirationDays, "days");

    const accessToken = generateToken(userId, accessTokenExpires, TokenType.Access);
    const refreshToken = generateToken(userId, refreshTokenExpires, TokenType.Refresh);

    await saveToken(accessToken, userId, accessTokenExpires, TokenType.Access);
    await saveToken(refreshToken, userId, refreshTokenExpires, TokenType.Refresh);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Verifies a token
 *
 * @param token The token to be verified
 * @param skipDelete
 * @returns The token from the db if verified, else returns null
 */
const consumeToken = async (token: string, skipDelete?: boolean): Promise<any> => {
  try {
    const secret = envConfig.jwt.secret;

    const payload = await verifyToken(token, secret);

    const userId = payload.sub;
    if (!userId || typeof userId !== "string") {
      throw new Error("invalid token");
    }
    skipDelete ? await findToken(token) : await findAndDeleteToken(token);

    return payload;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Generate token
 *
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} type
 * @param secret
 * @param blacklisted
 * @returns {string}
 */
const generateToken = (
  userId: string,
  expires: Moment,
  type: string,
  secret?: string,
  blacklisted?: boolean,
): string => {
  const payload: any = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    blacklisted,
  };

  const jwtSecret = secret || process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw Error("Missing env var JWT_SECRET");
  }

  return jwt.sign(payload, jwtSecret);
};

/**
 * Save token in db
 *
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {TokenType} type
 * @param blacklisted
 * @returns {Promise}
 */
const saveToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: TokenType,
  blacklisted = false,
): Promise<void> => {
  try {
    // If this is access or refresh token, delete before inserting
    if (AuthTokenTypes.includes(type)) {
      await eaasKnex("tokens").where({ user_id: userId, type }).delete();
    }

    await eaasKnex("tokens").insert({
      token,
      user_id: userId,
      expires: expires.toISOString(),
      type,
      blacklisted,
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Generates a reset password token given a user's email
 *
 * @param email The user's email
 * @returns The reset password token as a string
 */
const generateResetPasswordToken = async (email: string): Promise<string> => {
  const resetPasswordExpirationMinutes = process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || 30;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) throw new Error("no users found with this email");

    const expires = moment().add(resetPasswordExpirationMinutes, "minutes");

    const resetPasswordToken = generateToken(user.id, expires, TokenType.ResetPassword);

    await eaasKnex("tokens").insert({
      token: resetPasswordToken,
      user_id: user.id,
      expires: expires.toISOString(),
      type: TokenType.ResetPassword,
    });
    return resetPasswordToken;
  } catch (error) {
    throw new Error(error);
  }
};

const generateVerifyEmailToken = async (userId: string): Promise<string> => {
  try {
    const expires = moment().add(envConfig.jwt.verifyEmailExpirationMinutes, "minutes");
    const verifyEmailToken = generateToken(userId, expires, TokenType.VerifyEmail);
    await eaasKnex("tokens").insert({
      token: verifyEmailToken,
      user_id: userId,
      expires: expires.toISOString(),
      type: TokenType.VerifyEmail,
    });
    return verifyEmailToken;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Generates an invitation token to be included in a link that is emailed to the
 * recipient of an invitation
 *
 * @param senderId the id of the user sending the invite
 * @param invitationId the id of the invitation record
 * @returns
 */
const generateInviteToken = async (senderId: string, invitationId: string): Promise<string> => {
  try {
    const expires = moment().add(envConfig.jwt.inviteExpirationDays, "days");
    const payload: any = {
      sub: senderId,
      iat: moment().unix(),
      exp: expires.unix(),
      type: TokenType.Invite,
      invitationId,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw Error("Missing env var JWT_SECRET");
    }

    const inviteToken = jwt.sign(payload, jwtSecret);

    await eaasKnex("tokens").insert({
      token: inviteToken,
      user_id: senderId,
      expires: expires.toISOString(),
      type: TokenType.Invite,
    });
    return inviteToken;
  } catch (error) {
    throw new Error(error);
  }
};

const verifyToken = (token: string, secret: Secret): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        reject(error);
      }
      if (payload) {
        resolve(payload as JwtPayload);
      } else {
        reject(new Error("Jwt has no payload"));
      }
    });
  });
};

export const findAndDeleteToken = async (token: string): Promise<void> => {
  const dbToken = await eaasKnex("tokens")
    .where({
      token,
      blacklisted: false,
    })
    .select("*")
    .delete()
    .returning("*")
    .then((x) => x[0]);

  if (!dbToken) {
    throw new Error("token not found");
  }
};

export const findToken = async (token: string): Promise<void> => {
  const dbToken = await eaasKnex("tokens")
    .where({
      token,
      blacklisted: false,
    })
    .select("*")
    .then((x) => x[0]);

  if (!dbToken) {
    throw new Error("token not found");
  }
};

export const tokenService = {
  generateAuthTokens,
  consumeToken,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  generateToken,
  generateInviteToken,
  verifyToken,
  findAndDeleteToken,
  findToken,
};
