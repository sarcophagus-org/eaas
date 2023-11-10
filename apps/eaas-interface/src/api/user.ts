import axios from "axios";
import { handleApiError } from "./utils";
import { EaasUser, EaasLoginResponse, RegisterUser } from "../types/EaasUser";
import { adminTokens } from "../store/tempMemoryStore";

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

export async function clientRegister(params: { user: RegisterUser; inviteToken: string }) {
  try {
    const { user, inviteToken } = params;

    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/register`, {
      user,
      inviteToken,
    });
    return res.status === 201;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getUserList(): Promise<EaasUser[] | undefined> {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/all`, {
      headers: {
        Authorization: `Bearer ${adminTokens?.access.token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data as EaasUser[];
  } catch (error) {
    handleApiError(error);
  }
}
