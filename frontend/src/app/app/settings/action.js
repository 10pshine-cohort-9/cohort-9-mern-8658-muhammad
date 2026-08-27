"use server";

import { cookies } from "next/headers";
import { AxiosReq } from "@/lib/api/server-api";

export async function DeleteAccount() {
  try {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        success: false,
      };
    }

    const api = await AxiosReq();

    await api.delete("/user");

    cookiesStore.delete("access_token");
    cookiesStore.delete("refresh_token");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
}
