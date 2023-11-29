import { handleApiError } from "./utils";
import { EaasUser, EaasLoginResponse, RegisterUser } from "../types/userTypes";
import { axiosInstance as axios } from ".";

export async function login(params: {
  email: string;
  password: string;
}): Promise<EaasLoginResponse> {
  try {
    const { email, password } = params;

    const res = await axios.post(`auth/login`, {
      email,
      password,
    });

    return res.data as EaasLoginResponse;
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

    const res = await axios.post(`user/register`, {
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
