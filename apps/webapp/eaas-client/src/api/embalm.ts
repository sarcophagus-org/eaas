import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { ArchConfig, SendEncryptedPayloadParams } from "../types/embalm";
import { encrypt } from "ecies-geth";
import { ethers } from "ethers";

export async function sendPayload(
  params: SendEncryptedPayloadParams,
  pdfPassword: string,
  pdfBuffer: Buffer,
) {
  try {
    const encryptedPdfBlob = await encrypt(Buffer.from(ethers.utils.arrayify(pdfPassword)), pdfBuffer);

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
