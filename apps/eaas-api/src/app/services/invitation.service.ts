import { EaasUser } from "../../../src/types/EaasUser";
import { knex } from "../../../src/database";
import { Invitation } from "../../../src/types/Invitation";
import { tokenService } from "./token.service";
import { userService } from "./user.service";
import { emailService } from "./email.service";
import { apiErrors } from "../utils/errors";

/**
 * Creates an invitation record
 *
 * @param recipientEmail the email of the recipient
 * @param sender the sender's EaasUser
 * @returns the invitation id
 */
const createInvitation = async (params: {
  recipientEmail: string;
  sender: EaasUser;
}): Promise<string> => {
  const { recipientEmail, sender } = params;

  // Make sure the recipient doesn't already exist
  try {
    const user = await userService.getUserByEmail(recipientEmail);
    if (user) {
      throw apiErrors.userAlreadyExists;
    }
  } catch (e) {
    if (e === apiErrors.userNotFound) {
      // continue
    }
  }

  const invitations = await knex("invitations").where({
    recipient_email: recipientEmail.toLowerCase(),
  });
  if (invitations.length > 0) {
    throw apiErrors.userAlreadyInvited;
  }

  const invitation = await knex("invitations")
    .insert({
      recipient_email: recipientEmail.toLowerCase(),
      sender_id: sender.id,
    })
    .returning("id")
    .then((x) => x[0]);

  const invitationId = invitation.id;

  if (!invitationId) throw new Error("could not create invitation");

  // Add the invitation id to the token for looking up the invitation when
  // the recipient accepts the invitations
  const inviteToken = await tokenService.generateInviteToken(sender.id, invitationId);

  await emailService.sendNewUserInviteEmail({
    to: recipientEmail,
    token: inviteToken,
    sender,
  });

  return invitationId;
};

/**
 * Validates the invite token
 * @param inviteToken
 * @return User | undefined
 */
const validateInviteToken = async (inviteToken: string): Promise<EaasUser | undefined> => {
  const payload = await tokenService.consumeToken(inviteToken, true);
  const { invitationId } = payload;
  if (!invitationId) {
    throw apiErrors.invalidInvitationToken;
  }
  const invitation = await getInvitationOrThrowError(invitationId);

  return userService.getUserByEmail(invitation.recipient_email);
};

/**
 * retrieves application invitations based on sender_id
 *
 * @param userId
 * @returns
 */
const getSenderInvitations = async (userId: string) => {
  const users = await knex("invitations").select("invitations.*").where({ sender_id: userId });
  return users;
};

/**
 * Get an invitation by id or throw error
 *
 * @param id the invitation id
 * @returns the invitation record
 */
const getInvitationOrThrowError = async (id: string): Promise<Invitation> => {
  const invitation = await knex("invitations")
    .where({ id })
    .select("*")
    .then((x) => x[0]);

  if (!invitation) {
    throw apiErrors.invitationNotFound;
  }

  return invitation;
};

/**
 * Deletes an invitation
 *
 * @param id the invitatoin id
 */
const deleteInvitation = async (userId: string, id: string): Promise<void> => {
  await knex("invitations").where({ id, sender_id: userId }).delete();
};

export const invitationService = {
  createInvitation,
  validateInviteToken,
  getSenderInvitations,
  getInvitationOrThrowError,
  deleteInvitation,
};
