import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { SarcophagusData } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { createEncryptor } from "simple-encryptor";
import { createHash } from "crypto-browserify";
import { SarcophagusDataWithClientEmail } from "types/sarcophagi";

export async function getUserSarcophagi(): Promise<SarcophagusDataWithClientEmail[]> {
  try {
    const res = await axios.get("sarcophagi/all");
    return res.data as SarcophagusData[];
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function rewrapSarco(sarcoId: string, resurrectionTime: number): Promise<void> {
  try {
    await axios.post("sarcophagi/rewrap", {
      sarcoId,
      resurrectionTime,
    });
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function cleanSarco(sarcoId: string): Promise<void> {
  try {
    await axios.post("sarcophagi/clean", {
      sarcoId,
    });
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function burySarco(sarcoId: string): Promise<void> {
  try {
    await axios.post(`sarcophagi/bury`, {
      sarcoId,
    });
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function downloadRecipientPdf(sarcoId: string, password: string): Promise<Buffer> {
  try {
    const res = await axios.post(`sarcophagi/download-pdf`, { sarcoId });

    const encryptedPdf = res.data.encryptedPdf as string;
    const hashedPassword = createHash("sha256").update(password).digest("hex").substring(0, 32);

    const decryptedPdfStr = createEncryptor(hashedPassword).decrypt(encryptedPdf)?.data;
    if (!decryptedPdfStr) {
      // eslint-disable-next-line no-throw-literal
      throw "Check your password and try again";
    }

    return decryptedPdfStr;
  } catch (error) {
    throw handleApiError(error);
  }
}
