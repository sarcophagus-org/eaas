import { Request, Response } from "express";
import { invitationService } from "../services";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { tryRunController } from "./tryRunController";

const createInvitation = tryRunController(async (req: RequestWithUser, res: Response) => {
    const sender = req.user;

    const { recipients } = req.body;
    const recipientEmail = recipients[0];

    await invitationService.createInvitation({
      recipientEmail,
      sender,
    });

    res.status(201).send();
});

const validateInviteToken = tryRunController(async (req: Request, res: Response) => {
    const { token } = req.body;
    const user = await invitationService.validateInviteToken(token);

    res.status(200).json(user);
});

const getSenderInvitations = tryRunController(async (req: RequestWithUser, res: Response) => {
  const user = req.user;
    const invitations = await invitationService.getSenderInvitations(user.id);
    res.send(invitations);
});

/**
 * Delete invitation by given id.
 * Will not take account for any invites on resources.
 */
const deleteInvitation = tryRunController(async (req: RequestWithUser, res: Response) => {
  const user = req.user;
  const { invitationId } = req.body;
    const invitations = await invitationService.deleteInvitation(user.id, invitationId as string);
    res.send(invitations);
});

export const invitationController = {
  createInvitation,
  validateInviteToken,
  getSenderInvitations,
  deleteInvitation,
};
