import axios from "axios";
import { SendEncryptedPayloadParams } from "../../../../packages/types";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-payload`, params);
  return res.status === 200;
}

export async function testApi() {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`);
  return res.data;
}
