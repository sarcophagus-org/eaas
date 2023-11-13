import { Request, Response } from "express";
import { invitationService } from "../services";
import { RequestWithUser } from "../../../src/types/EaasUser";

const createInvitation = async (req: RequestWithUser, res: Response) => {
  try {
    const sender = req.user;

    const { recipients } = req.body;
    const recipientEmail = recipients[0];

    await invitationService.createInvitation({
      recipientEmail,
      sender,
    });

    res.status(201).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validateInviteToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await invitationService.validateInviteToken(token);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSenderInvitations = async (req: RequestWithUser, res: Response) => {
  const user = req.user;
  try {
    const invitations = await invitationService.getSenderInvitations(user.id);
    res.send(invitations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete invitation by given id.
 * Will not take account for any invites on resources.
 */
const deleteInvitation = async (req: RequestWithUser, res: Response) => {
  const user = req.user;
  const { invitationId } = req.body;
  try {
    const invitations = await invitationService.deleteInvitation(user.id, invitationId as string);
    res.send(invitations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const invitationController = {
  createInvitation,
  validateInviteToken,
  getSenderInvitations,
  deleteInvitation,
};
