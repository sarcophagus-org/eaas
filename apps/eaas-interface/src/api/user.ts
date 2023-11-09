import axios from "axios";
import { handleApiError } from "./utils";
import { EaasUser, EaasLoginResponse } from "../types/EaasUser";

export async function login(params: {
  email: string;
  password: string;
}): Promise<EaasLoginResponse | undefined> {
  try {
    const { email, password } = params;

    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    return res.data as EaasLoginResponse;
  } catch (error) {
    // TODO: sort out a way to cleanly bubble up this error to the UI
    handleApiError(error);
  }
}

export async function getUserList(): Promise<EaasUser[] | undefined> {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/all`);
    return res.data as EaasUser[];
  } catch (error) {
    handleApiError(error);
  }
}
