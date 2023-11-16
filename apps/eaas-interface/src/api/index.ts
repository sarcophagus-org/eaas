import axios, { AxiosRequestHeaders } from "axios";
import { handleApiError } from "./utils";
import { getAccessToken } from "../localStorage";

export async function testApi() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 15000,
});

instance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();

    if (!accessToken) return config;

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    } as AxiosRequestHeaders;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export const axiosInstance = instance;
