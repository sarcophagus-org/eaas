import { Response } from "express";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { embalmService } from "../services";
import { SendEncryptedPayloadParams } from "../../../src/types/embalmPayload";

/**
 * Embalm the provided payload
 */
const runEmbalm = async (req: RequestWithUser, res: Response) => {
  const { preparedEncryptedPayload, resurrectionTime, sarcoId } = req.body as SendEncryptedPayloadParams;

  await embalmService.runEmbalm({
    preparedEncryptedPayload,
    resurrectionTime,
    clientId: req.user.id,
    sarcoId,
  });

  res.status(200).send("Success");
};

/**
 * Get the number of archaeologists
 */
const getArchaeologistConfig = async (_: RequestWithUser, res: Response) => {
  const config = await embalmService.getArchaeologistConfig();
  res.status(200).send(config);
};

export const embalmController = {
  runEmbalm,
  getArchaeologistConfig,
};
