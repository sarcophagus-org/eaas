import axios from "axios";
import { handleApiError } from "./utils";

export async function inviteClient(email: string) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/invitation/create`,
      {
        recipients: [email],
      },
      {
        headers: {
          Authorization: `Bearer ${userTokens?.access.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.status === 200;
  } catch (error) {
    handleApiError(error);
  }
}
