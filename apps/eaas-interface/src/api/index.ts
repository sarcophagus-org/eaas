import axios from "axios";
import { handleApiError } from "./utils";

export async function testApi() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}
