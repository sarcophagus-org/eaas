import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";
import { Invitation } from "types/invitation";

export async function inviteClient(email: string) {
  try {
    const res = await axios.post(`invitation/create`, {
      recipients: [email],
    });
    return res.status === 200;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getInvites() {
  try {
    const res = await axios.get(`invitation/all`);
    return res.data as Invitation[];
  } catch (error) {
    throw handleApiError(error);
  }
}
