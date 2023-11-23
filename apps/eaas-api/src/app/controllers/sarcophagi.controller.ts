import { Response } from "express";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { sarcophagiService } from "../services";

const getClientSarcophagi = async (req: RequestWithUser, res: Response) => {
  const { user } = req;

  const clientSarcophagi = await sarcophagiService.getClientSarcophagi(user.id);

  res.status(200).send(clientSarcophagi);
};

export const sarcophagiController = {
  getClientSarcophagi,
};
