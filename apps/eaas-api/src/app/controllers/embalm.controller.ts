import { Response } from "express";
import { RequestWithUser } from "../../../src/types/EaasUser";
import { SendEncryptedPayloadParams } from "../../../../common/types";
import { formatPreparedEncryptedPayload, runEmbalm } from "src/utils/embalm";
import { logging } from "src/utils/logger";
import { handleApiError } from "../utils/errors";

/**
 * Delete invitation by given id.
 * Will not take account for any invites on resources.
 */
const sendEncryptedPayload = async (req: RequestWithUser, res: Response) => {
  try {
    const { preparedEncryptedPayload, threshold, resurrectionTime, sarcophagusName, chainId } =
      req.body as SendEncryptedPayloadParams;

    // TODO: get from embalm.service
    await runEmbalm({
      chainId,
      preparedEncryptedPayload: formatPreparedEncryptedPayload(preparedEncryptedPayload),
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
