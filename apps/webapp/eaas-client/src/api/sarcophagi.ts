import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { SarcophagusData } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

export async function getClientSarcophagi(): Promise<SarcophagusData[]> {
  try {
    const res = await axios.get(`sarcophagi/all`);
    return res.data as SarcophagusData[];
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getSarcoClientEmail(sarcoId: string): Promise<string> {
  try {
    const response = await axios.get(`sarcophagi/${sarcoId}/client-email`);
    return response.data as string;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function rewrapSarco(sarcoId: string, resurrectionTime: number): Promise<void> {
  try {
    await axios.post(`sarcophagi/rewrap`, {
      sarcoId,
      resurrectionTime,
    });
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function cleanSarco(sarcoId: string): Promise<void> {
  try {
    await axios.post(`sarcophagi/clean`, {
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
