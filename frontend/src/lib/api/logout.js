"use server";

import { cookies } from "next/headers";
import { AxiosReq } from "./server-api";

export const Userlogout = async () => {
  let api = await AxiosReq();
  let cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;
  try {
    if (!accessToken) {
      return {
        success: false,
      };
    }
    const res = await api.post("/auth/signout");
    if (res.status !== 201) {
      return {
        success: false,
      };
    }
    cookiesStore.delete("access_token");
    cookiesStore.delete("refresh_token");
    return {
      success: true,
    };
  } catch (error) {
    return { success: false };
  }
};
