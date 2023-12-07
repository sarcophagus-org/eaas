import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { ArchConfig, SendEncryptedPayloadParams } from "../types/embalm";
import { createEncryptor } from "simple-encryptor";
import bcrypt from "bcryptjs";

export async function sendPayload(
  params: SendEncryptedPayloadParams,
  pdfPassword: string,
  pdfBuffer: Buffer,
) {
  try {
    const hashedPassword = await bcrypt.hash(pdfPassword, 10);

    const encryptedPdfStr = createEncryptor(hashedPassword).encrypt(pdfBuffer);
    const encryptedPdfBlob = Buffer.from(encryptedPdfStr);

    await axios.post(`embalm/send-payload`, {
      ...params,
      encryptedPdfBlob,
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
