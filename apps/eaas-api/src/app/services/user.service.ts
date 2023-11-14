import bcrypt from "bcrypt";
import { tokenService } from "./token.service";
import { eaasKnex } from "../../database";
import { JwtPayload } from "../../../src/types/JwtPayload";
import { EaasUser } from "../../../src/types/EaasUser";
import { invitationService } from "./invitation.service";
import { apiErrors } from "../utils/errors";

const userFields = ["id", "created_at", "updated_at", "email", "is_embalmer", "is_email_verified"];

const getAllUsers = async (): Promise<EaasUser[]> => {
  return await eaasKnex("users").select(...userFields);
};

/**
 * Creates a user
 * @returns a new user object
 */
const createUser = async (params: { email: string; password: string }): Promise<EaasUser> => {
  const { email, password } = params;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await eaasKnex("users")
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
    await eaasKnex("embalmer_has_clients").insert({
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
  const user = await eaasKnex("users")
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
  const user = await eaasKnex("users")
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
  const users = await eaasKnex("users")
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

// TODO: Implement fuzzy search
/**
 * Searches for users by name or email with a string pattern
 *
 * Searches the users DB by email with wildcards at the start and end of
 * the pattern string. If a record exists with the name "Peter McPeterson",
 * searchUsers("ete") will return that record or any other record that contains
 * the string "ete". The wildcards are applied per word, so a search for the
 * pattern "Pet Mc" will also return the result for "Peter McPeterson". If the
 * pattern contains a space(s) the method will assume that the pattern is a
 * name.
 *
 * The search is not case sensitive.
 *
 * This is not a fuzzy search. In other words, if a record exists with the name
 * "Peter McPeterson", a search for the pattern "Pter" will not return the
 * record.
 *
 * There are postgres extensions that allow for fuzzy search but postgres
 * extensions are pain to get installed, to get working properly, and to
 * maintain for both dev and test environments. But if we decide to implement
 * fuzzy search it should be done at the DB level.
 *
 * An alternative would be to pull every user from the db and use a javascript
 * fuzzy search library like fuse.js on the list. This is very expensive
 * especially if there a lots of users in the system.
 *
 * An other alternative would be to pull the list of users and store it in
 * memory, then update it only when a user is added or removed from the db. Then
 * a javascript fuzzy search library could be used on that list. Again, this
 * would be expensive on memory if there are lots of users
 *
 * @param pattern the string to search for
 * @returns a list of users with the fields id and email
 */
const searchUsers = async (pattern: string): Promise<Partial<EaasUser>[]> => {
  // an empty string should return an empty array
  if (pattern.trim().length === 0) {
    return [];
  }

  // if pattern contains a space, search only for names and use the "and" operator
  if (pattern.trim().indexOf(" ") >= 0) {
    const words = pattern.trim().split(" ");

    // Build a query with an whereRaw method for each word.
    // The result would look something like this:
    // knex("users")
    //  .whereRaw("LOWER(name) LIKE ?", `%${words[0].toLowerCase()}%`))
    //  .whereRaw("LOWER(name) LIKE ?", `%${words[1].toLowerCase()}%`))
    //  ...
    //
    // Supports unlimited words. Because why not?
    // The query is not case sensitive.
    const query = words.reduce(
      (prev, word) => prev.whereRaw("LOWER(name) LIKE ?", `%${word.toLowerCase()}%`),
      eaasKnex("users"),
    );

    return query.select("id", "email");
  } else {
    // The assumption is that an email should never has spaces, but a name may also have no spaces
    return await eaasKnex("users")
      .whereRaw("LOWER(email) LIKE ?", `%${pattern.toLowerCase()}%`)
      .select("id", "email");
  }
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

  const user = await eaasKnex("users")
    .where({ id })
    .select("*")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  Object.assign(user, updateBody);

  const updatedUser = await eaasKnex("users")
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
  const user = await eaasKnex("users")
    .where({ id: userId })
    .select("*")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  Object.assign(user, { password: hashedPassword });
  await eaasKnex("users").where({ id: userId }).update(user);
};

/**
 * Updates the email verified field on a user
 *
 * @param userId the user's id
 * @param isEmailVerified
 */
const setEmailVerifiedStatus = async (userId: string, isEmailVerified: boolean): Promise<void> => {
  const user = await eaasKnex("users")
    .where({ id: userId })
    .select("*")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  Object.assign(user, { is_email_verified: isEmailVerified });
  await eaasKnex("users").where({ id: userId }).update(user);
};

/**
 * Deletes all tokens tied to a user
 *
 * @param userId the user id
 */
const deleteTokensFromUser = async (userId: string): Promise<void> => {
  await eaasKnex("tokens").where({ user_id: userId }).delete();
};

/**
 * Deletes all tokens tied to a user
 *
 * @param id
 */
export const deleteUser = async (id: string): Promise<void> => {
  const user = await eaasKnex("users")
    .where({ id })
    .select("id")
    .then((x) => x[0]);

  if (!user) throw apiErrors.userNotFound;

  await eaasKnex("users").where({ id }).delete();
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
  deleteUser,
  searchUsers,
};
