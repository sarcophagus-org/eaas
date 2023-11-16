import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { SendEncryptedPayloadParams } from "../types/embalmPayload";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  try {
    const res = await axios.post(
      `embalm/send-payload`,
      params,
    );
    return res.status === 200;
  } catch (error) {
    handleApiError(error);
    return false;
  }
}
