import axios from "axios";
import { SendEncryptedPayloadParams } from "../../../common/types";
import { handleApiError } from "./utils";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-payload`, params);
  return res.status === 200;
}

export async function testApi() {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`);
  return res.data;
}

export async function login(params: { email: string; password: string }) {
  try {
    const { email, password } = params;
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    console.log(res.data);
    return res.status === 200;
  } catch (error) {
    handleApiError(error);
    // sort out a way to cleanly bubble up this error to the UI
  }
}
