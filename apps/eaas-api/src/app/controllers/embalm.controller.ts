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
  });

  res.status(200).send("Success");
};

export const embalmController = {
  runEmbalm,
};
