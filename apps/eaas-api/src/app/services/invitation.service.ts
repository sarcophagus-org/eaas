import { EaasUser } from "../../../src/types/EaasUser";
import { eaasKnex } from "../../../src/database";
import { Invitation } from "../../../src/types/Invitation";
import { tokenService } from "./token.service";
import { userService } from "./user.service";
import { authService } from "./auth.service";
import { emailService } from "./email.service";

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

  const user = await userService.getUserByEmail(recipientEmail);
  if (user) {
    throw new Error("User already exists");
  }

  const invitations = await eaasKnex("invitations").where({
    recipient_email: recipientEmail.toLowerCase(),
  });
  if (invitations.length > 0) {
    throw new Error("User already invited");
  }

  const invitationId = await eaasKnex("invitations")
    .insert({
      recipient_email: recipientEmail.toLowerCase(),
      sender_id: sender.id,
    })
    .returning("id")
    .then((x) => x[0]);

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
 * Accepts an invite to a resource, like an aircraft or a transaction.
 *
 * @param inviteToken the invite token
 */
const acceptInvitation = async (inviteToken: string): Promise<{ user: EaasUser }> => {
  // get invitation id from payload of inviteToken and delete the inviteToken
  const payload = await tokenService.consumeToken(inviteToken, true);
  const { invitationId } = payload;
  if (!invitationId) {
    throw new Error("there is no invitation linked to this inviteToken");
  }

  // look up invitation by the invitation id
  const invitation = await getInvitationOrThrowError(invitationId);

  // look up recipient in the users table by email
  const recipient = await userService.getUserByEmail(invitation.recipient_email);

  if (!recipient) {
    throw Error(`No user found with email: ${invitation.recipient_email}`);
  }

  // create a record in the connections table with the sender id and the recipient id
  // this currently has no use in the application, but may be useful in the future

  try {
    await eaasKnex("embalmer_has_client").insert({
      embalmer_id: invitation.sender_id,
      client_id: recipient.id,
    });
  } catch (error) {
    console.error("cant create embalmer_has_client record", error);
  }

  await tokenService.findAndDeleteToken(inviteToken);
  await deleteInvitation(invitation.sender_id, invitation.id);

  return { user: recipient };
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
    throw new Error("there is no invitation linked to this inviteToken");
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
  const users = await eaasKnex("invitations").select("invitations.*").where({ sender_id: userId });
  return users;
};

/**
 * Determines if the a user inviting someone is authorized to do so
 *
 * Simply throws an error if sender is not authorized.
 *
 * @param senderId the user id of the sender
 */
const authorizeSender = async (senderId: string): Promise<void> => {
  try {
    const user = await userService.getUserById(senderId);
    if (user.is_admin) return;
  } catch (error) {
    throw new Error("User is not authorized to create invitations");
  }
};

/**
 * Get an invitation by id or throw error
 *
 * @param id the invitation id
 * @returns the invitation record
 */
const getInvitationOrThrowError = async (id: string): Promise<Invitation> => {
  const invitation = await eaasKnex("invitations")
    .where({ id })
    .select("*")
    .then((x) => x[0]);

  if (!invitation) {
    throw new Error(`No invitation found with ID: ${id}`);
  }

  return invitation;
};

/**
 * Deletes an invitation
 *
 * @param id the invitatoin id
 */
const deleteInvitation = async (userId: string, id: string): Promise<void> => {
  await eaasKnex("invitations").where({ id, sender_id: userId }).delete();
};

export const invitationService = {
  createInvitation,
  validateInviteToken,
  acceptInvitation,
  getSenderInvitations,
  authorizeSender,
  getInvitationOrThrowError,
  deleteInvitation,
};
