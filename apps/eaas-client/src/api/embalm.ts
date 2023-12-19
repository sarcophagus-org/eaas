import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { ArchConfig, SendEncryptedPayloadParams } from "../types/embalm";
import { createEncryptor } from "simple-encryptor";
import { createHash } from "crypto-browserify";

export async function sendPayload(
  params: SendEncryptedPayloadParams,
  pdfPassword: string,
  pdfBuffer: Buffer,
) {
  try {
    const hashedPassword = createHash("sha256").update(pdfPassword).digest("hex").substring(0, 32);
    const encryptedPdfStr = createEncryptor(hashedPassword).encrypt(pdfBuffer);

    await axios.post(`embalm/send-payload`, {
      ...params,
      encryptedPdfStr,
    });
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
