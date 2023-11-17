import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { SendEncryptedPayloadParams } from "../types/embalmPayload";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  try {
    await axios.post(`embalm/send-payload`, params);
  } catch (error) {
    throw handleApiError(error);
  }
}
