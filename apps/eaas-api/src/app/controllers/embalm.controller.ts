import { Response } from "express";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { SendEncryptedPayloadParams } from "../../../../common/types";
import { handleApiError } from "../utils/errors";
import { embalmService } from "../services";

/**
 * Delete invitation by given id.
 * Will not take account for any invites on resources.
 */
const sendEncryptedPayload = async (req: RequestWithUser, res: Response) => {
  try {
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
  } catch (e) {
    handleApiError(res, e);
  }
};

export const embalmController = {
  sendEncryptedPayload,
};
