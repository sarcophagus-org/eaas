import { handleApiError } from "./utils";
import { EaasUser, EaasLoginResponse, RegisterUser } from "../types/userTypes";
import { axiosInstance as axios } from ".";

import unauthedAxios from "axios";
const unauthedAxiosInstance = unauthedAxios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export async function login(params: {
  email: string;
  password: string;
}): Promise<EaasLoginResponse> {
  try {
    const { email, password } = params;

    const res = await unauthedAxiosInstance.post(`auth/login`, {
      email,
      password,
    });

    return res.data as EaasLoginResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await unauthedAxiosInstance.post(`auth/forgot-password`, { email });
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function resetPassword(params: { password: string; token: string }): Promise<void> {
  try {
    await unauthedAxiosInstance.post(`auth/reset-password`, params);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function clientRegister(params: {
  user: RegisterUser;
  inviteToken: string;
}): Promise<EaasLoginResponse> {
  try {
    const { user, inviteToken } = params;

    const res = await unauthedAxiosInstance.post(`user/register`, {
      user,
      inviteToken,
    });

    return res.data as EaasLoginResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUserList(): Promise<EaasUser[]> {
  try {
    const res = await axios.get(`user/all`);
    return res.data as EaasUser[];
  } catch (error) {
    throw handleApiError(error);
  }
}
