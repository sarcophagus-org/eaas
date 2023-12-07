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

const rewrapSarcophagus = async (req: RequestWithUser, res: Response) => {
  const { sarcoId, resurrectionTime } = req.body;
  await sarcophagiService.rewrapSarcophagus(sarcoId, resurrectionTime);
  res.status(200).send();
};

const cleanSarcophagus = async (req: RequestWithUser, res: Response) => {
  const { sarcoId } = req.body;
  await sarcophagiService.cleanSarcophagus(sarcoId);
  res.status(200).send();
};

const burySarcophagus = async (req: RequestWithUser, res: Response) => {
  const { sarcoId } = req.body;
  await sarcophagiService.burySarcophagus(sarcoId);
  res.status(200).send();
};

const downloadRecipientPdf = async (req: RequestWithUser, res: Response) => {
  const { sarcoId } = req.body;
  const user = req.user;
  const encryptedPdf = await sarcophagiService.downloadRecipientPdf({
    sarcoId,
    clientId: user.id,
  });
  res.status(200).send({ encryptedPdf });
};

export const sarcophagiController = {
  getClientSarcophagi,
  getSarcoClientEmail,
  rewrapSarcophagus,
  cleanSarcophagus,
  burySarcophagus,
  downloadRecipientPdf,
};
