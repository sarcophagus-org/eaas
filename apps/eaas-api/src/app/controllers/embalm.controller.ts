import { Response } from "express";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { SendEncryptedPayloadParams } from "../../../../common/types";
import { embalmService } from "../services";

/**
 * Embalm the provided payload
 */
const runEmbalm = async (req: RequestWithUser, res: Response) => {
  const { preparedEncryptedPayload, threshold, resurrectionTime, sarcophagusName, chainId } =
    req.body as SendEncryptedPayloadParams;

  await embalmService.runEmbalm({
    chainId,
    preparedEncryptedPayload,
    requiredArchaeologists: threshold,
    resurrectionTime,
    sarcophagusName,
  });

  res.status(200).send("Success");
};

export const embalmController = {
  runEmbalm,
};
