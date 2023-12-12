import axios, { AxiosRequestHeaders } from "axios";
import { handleApiError } from "./utils";
import { getAccessToken } from "../localStorage";

console.log("process.env.REACT_APP_API_BASE_URL", process.env.REACT_APP_API_BASE_URL);

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 120000,
});

instance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();

    if (!accessToken) return config;

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken.token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    } as AxiosRequestHeaders;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export async function testApi() {
  try {
    const res = await instance.get("/");
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export const axiosInstance = instance;
