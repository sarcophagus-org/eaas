import { Response } from "express";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { sarcophagiService } from "../services";

const getClientSarcophagi = async (req: RequestWithUser, res: Response) => {
  const { user } = req;

  const clientSarcophagi = await sarcophagiService.getClientSarcophagi(user.id);

  res.status(200).send(clientSarcophagi);
};

const getSarcoClientEmail = async (req: RequestWithUser, res: Response) => {
  const { sarcoId } = req.params;

  const clientEmail = await sarcophagiService.getSarcoClientEmail(sarcoId);

  res.status(200).send(clientEmail);
};

export const sarcophagiController = {
  getClientSarcophagi,
  getSarcoClientEmail,
};
