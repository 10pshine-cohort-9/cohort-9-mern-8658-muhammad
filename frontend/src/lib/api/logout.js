"use server";

import { cookies } from "next/headers";
import { AxiosReq } from "./server-api";

export let Userlogout = async () => {
  let api = await AxiosReq();
  let cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;
  try {
    if (accessToken) {
      const res = await api.post("/auth/signout");
      console.log(res);
      if (res.status === 201) {
        cookiesStore.delete("access_token");
        cookiesStore.delete("refresh_token");
        return {
          success: true,
        };
      } else {
        return { success: false };
      }
    }
  } catch (error) {
    return { success: false };
  }
};
