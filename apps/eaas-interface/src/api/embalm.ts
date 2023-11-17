import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { SendEncryptedPayloadParams } from "../types/embalmPayload";
import { getAccessToken } from "../localStorage";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  try {
    const formData = new FormData();
    formData.append("preparedEncryptedPayload", JSON.stringify(params.preparedEncryptedPayload));
    formData.append("chainId", params.chainId.toString());
    formData.append("threshold", params.threshold.toString());
    formData.append("resurrectionTime", params.resurrectionTime.toString());

    await axios.post(`embalm/send-payload`, formData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw handleApiError(error);
  }
}
