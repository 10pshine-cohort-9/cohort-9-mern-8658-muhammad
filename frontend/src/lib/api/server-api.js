"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { API_URL } from "./axios";
import { redirect } from "next/navigation";

export async function AxiosReq() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
}
