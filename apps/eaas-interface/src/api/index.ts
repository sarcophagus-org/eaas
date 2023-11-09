import axios from "axios";
import { SendEncryptedPayloadParams } from "../../../common/types";
import { handleApiError } from "./utils";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-payload`, params);
    return res.status === 200;
  } catch (error) {
    handleApiError(error);
    return false;
  }
}

export async function testApi() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}
