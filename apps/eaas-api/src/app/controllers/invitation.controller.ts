import { Request, Response } from "express";
import { invitationService, tokenService } from "../services";
import { RequestWithUser } from "src/types/EaasUser";

const createInvitation = async (req: RequestWithUser, res: Response) => {
  try {
    const sender = req.user;
    const { recipientEmail } = req.body;

    await invitationService.authorizeSender(sender.id);

    await invitationService.createInvitation(recipientEmail, sender.id);

    // TODO: send email to recipients

    res.status(201).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const acceptInvite = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const { user } = await invitationService.acceptInvitation(token);
    const tokens = await tokenService.generateAuthTokens(user.id);

    res.status(200).json({ user, tokens });
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
  acceptInvite,
  validateInviteToken,
  getSenderInvitations,
  deleteInvitation,
};
