import axios from "axios";
import { SendEncryptedPayloadParams } from "../../../common/types";
import { handleApiError } from "./utils";
import { userTokens } from "../store/tempMemoryStore";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/embalm/send-payload`,
      params,
      {
        headers: {
          Authorization: `Bearer ${userTokens?.access.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.status === 200;
  } catch (error) {
    handleApiError(error);
    return false;
  }
}
