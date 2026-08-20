"use server";

import { AxiosReq } from "@/lib/api/server-api";
import { cookies } from "next/headers";

export async function DeleteAccount() {
  try {
    let cookiesStore = await cookies();
    const accessToken = cookiesStore.get("access_token")?.value;
    const api = await AxiosReq();

    if (accessToken) {
      const res = await api.delete("/user");

      cookiesStore.delete("access_token");
      cookiesStore.delete("refresh_token");
      return {
        success: true,
      };
    }
  } catch (error) {
    return { success: false };
  }
}
