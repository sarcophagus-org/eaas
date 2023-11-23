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
