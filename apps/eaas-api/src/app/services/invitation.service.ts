import { eaasKnex } from "../../../src/database";
import { Invitation } from "../../../src/types/Invitation";

/**
 * Get an invitation by id or throw error
 *
 * @param id the invitation id
 * @returns the invitation record
 */
const getInvitationOrThrowError = async (id: string): Promise<Invitation> => {
  try {
    const invitation = await eaasKnex("invitations")
      .where({ id })
      .select("*")
      .then((x) => x[0]);

    if (!invitation) {
      throw new Error(`No invitation found with ID: ${id}`);
    }

    return invitation;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Deletes an invitation
 *
 * @param id the invitatoin id
 */
const deleteInvitation = async (userId: string, id: string): Promise<void> => {
  try {
    await eaasKnex("invitations").where({ id, sender_id: userId }).delete();
  } catch (error) {
    throw new Error(error);
  }
};

export const invitationService = {
  getInvitationOrThrowError,
  deleteInvitation,
};
