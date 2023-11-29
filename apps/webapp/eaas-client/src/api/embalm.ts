import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { ArchConfig, SendEncryptedPayloadParams } from "../types/embalm";

export async function sendPayload(params: SendEncryptedPayloadParams) {
  try {
    await axios.post(`embalm/send-payload`, params);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getArchConfig(): Promise<ArchConfig> {
  try {
    const res = await axios.get(`embalm/archaeologist-config`);
    return res.data as ArchConfig;
  } catch (error) {
    throw handleApiError(error);
  }
}
