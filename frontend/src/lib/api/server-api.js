"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { API_URL } from "./axios";
import refreshToken from "./refresh-token";

export async function AxiosReq() {
  const cookiesStore = await cookies();
  let accessToken = cookiesStore.get("access_token")?.value;

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const orgReq = error.config;
      if (error.response?.status === 401 && !orgReq._retry) {
        orgReq._retry = true;
        const newAccessToken = await refreshToken();
        if (!newAccessToken) {
          return Promise.reject(error);
        }
        accessToken = newAccessToken;
        orgReq.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(orgReq);
      }
      return Promise.reject(error);
    },
  );

  return api;
}
