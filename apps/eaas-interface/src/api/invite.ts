import { handleApiError } from "./utils";
import { axiosInstance as axios } from ".";

export async function inviteClient(email: string) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/invitation/create`, {
      recipients: [email],
    });
    return res.status === 200;
  } catch (error) {
    handleApiError(error);
  }
}
