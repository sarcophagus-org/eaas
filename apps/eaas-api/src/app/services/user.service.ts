import bcrypt from "bcrypt";
import { tokenService } from "./token.service";
import { knex } from "../../database";
import { JwtPayload } from "../../../src/types/JwtPayload";
import { EaasUser } from "../../../src/types/EaasUser";
import { invitationService } from "./invitation.service";
import { apiErrors } from "../utils/errors";

const userFields = ["id", "created_at", "updated_at", "email", "is_embalmer", "is_email_verified"];

const getAllUsers = async (): Promise<EaasUser[]> => {
  return await knex("users").select(...userFields);
};

/**
 * Creates a user
 * @returns a new user object
 */
const createUser = async (params: { email: string; password: string }): Promise<EaasUser> => {
  const { email, password } = params;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await knex("users")
    .insert({
      email: email.toLowerCase(),
      password: hashedPassword,
    })
    .returning([...userFields])
    .then((x) => x[0]);

  return user;
};

/**
 * Creates a user given an invitation token
 * @returns a new user object
 */
const createUserWithInvite = async (params: {
  password: string;
  inviteToken: string;
}): Promise<{ user: EaasUser }> => {
  const { password, inviteToken } = params;
  // user must have an invite to be created
  if (!inviteToken) throw apiErrors.invalidInvitationToken;

  const { invitationId, sub } =
    (await tokenService.consumeToken(inviteToken, true)) || ({} as JwtPayload);

  // payload of invite token must include the invitation id
  if (!invitationId) {
    throw apiErrors.invalidInvitationToken;
  }

  // if invitation is not found the user should not be created
  const invitation = await invitationService.getInvitationOrThrowError(invitationId);

  try {
    const user = await createUser({ email: invitation.recipient_email, password });

    await tokenService.findAndDeleteToken(inviteToken);
    await invitationService.deleteInvitation(invitation.sender_id, invitation.id);

    if (!user || !user.id) {
      throw apiErrors.userNotFound;
    }

    // Link the user to the embalmer
    await knex("embalmer_has_clients").insert({
      embalmer_id: sub,
      client_id: user.id,
    });

    return { user };
  } catch (error) {
    if (error.message.includes("duplicate key value")) {
      throw apiErrors.emailAlreadyTaken;
    } else {
      throw error;
    }
  }
};

/**
 * Get a user by email
 *
 * @param email The user's email
 * @returns The user
 */
const getUserAndPasswordByEmail = async (email: string): Promise<[EaasUser, string]> => {
  const user = await knex("users")
    .where({ email: email.toLowerCase() })
    .select(...userFields, "password")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  const password = user.password;
  delete user.password;
  return [user, password];
};

/**
 * Get a user by email
 *
 * @param email The user's email
 * @returns The user
 */
const getUserByEmail = async (email: string): Promise<EaasUser> => {
  const user = await knex("users")
    .where({ email: email.toLowerCase() })
    .select(...userFields)
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  return user;
};

/**
 * Gets a list of users by ids
 *
 * @param ids the user ids
 * @returns a list of users
 */
const getUsersByIds = async (ids: string[]): Promise<EaasUser[]> => {
  const users = await knex("users")
    .whereIn("id", ids)
    .select(...userFields);

  if (!users) throw apiErrors.userNotFound;

  return users;
};

/**
 * Gets a user by id
 *
 * @param id the user id
 * @returns the user
 */
const getUserById = async (id: string): Promise<EaasUser> => {
  return (await getUsersByIds([id]))[0];
};

/**
 * Updates a user given an id and an update body
 *
 * @param id The user id
 * @param updateBody The update data
 * @returns The updated user
 */
const updateUserById = async (id: string, updateBody: Partial<EaasUser>): Promise<EaasUser> => {
  // TODO: manage whitelist with joi
  // Only allow whitelisted fields to be updated
  const whitelisted = ["email"];
  const notAllowed = Object.keys(updateBody).filter((x) => !whitelisted.includes(x));
  if (notAllowed.length > 0) {
    throw apiErrors.invalidUpdateFields;
  }

  const user = await knex("users")
    .where({ id })
    .select("*")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  Object.assign(user, updateBody);

  const updatedUser = await knex("users")
    .where({ id })
    .update(user)
    .returning(userFields)
    .then((x) => x[0]);
  return updatedUser;
};

/**
 * Updates the user's password given the user id and the hashed password
 *
 * @param userId the user's id
 * @param hashedPassword the new hashed password
 */
const updatePassword = async (params: {
  userId: string;
  hashedPassword: string;
}): Promise<void> => {
  const { userId, hashedPassword } = params;
  const user = await knex("users")
    .where({ id: userId })
    .select("*")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  Object.assign(user, { password: hashedPassword });
  await knex("users").where({ id: userId }).update(user);
};

/**
 * Updates the email verified field on a user
 *
 * @param userId the user's id
 * @param isEmailVerified
 */
const setEmailVerifiedStatus = async (userId: string, isEmailVerified: boolean): Promise<void> => {
  const user = await knex("users")
    .where({ id: userId })
    .select("*")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  Object.assign(user, { is_email_verified: isEmailVerified });
  await knex("users").where({ id: userId }).update(user);
};

/**
 * Deletes all tokens tied to a user
 *
 * @param userId the user id
 */
const deleteTokensFromUser = async (userId: string): Promise<void> => {
  await knex("tokens").where({ user_id: userId }).delete();
};

/**
 * Deletes all tokens tied to a user
 *
 * @param id
 */
export const deleteUser = async (id: string): Promise<void> => {
  const user = await knex("users")
    .where({ id })
    .select("id")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  await knex("users").where({ id }).delete();
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  createUserWithInvite,
  getUserByEmail,
  getUserAndPasswordByEmail,
  getUsersByIds,
  updateUserById,
  updatePassword,
  setEmailVerifiedStatus,
  deleteTokensFromUser,
  deleteUser
};
