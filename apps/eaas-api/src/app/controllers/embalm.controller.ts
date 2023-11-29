import { Response } from "express";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { embalmService } from "../services";
import { SendEncryptedPayloadParams } from "../../../src/types/embalmPayload";

/**
 * Embalm the provided payload
 */
const runEmbalm = async (req: RequestWithUser, res: Response) => {
  const { preparedEncryptedPayload, threshold, resurrectionTime } =
    req.body as SendEncryptedPayloadParams;

  await embalmService.runEmbalm({
    preparedEncryptedPayload,
    requiredArchaeologists: threshold,
    resurrectionTime,
    clientId: req.user.id,
  });

  res.status(200).send("Success");
};

/**
 * Get the number of archaeologists
 */
const getArchaeologistCount = async (_: RequestWithUser, res: Response) => {
  const count = await embalmService.getArchaeologistCount();
  res.status(200).send({ count });
}

export const embalmController = {
  runEmbalm,
  getArchaeologistCount,
};
