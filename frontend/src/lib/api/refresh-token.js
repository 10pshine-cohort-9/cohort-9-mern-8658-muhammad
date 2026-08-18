"use server";
import { cookies } from "next/headers";
import { axiosClient } from "./axios";

async function refreshToken() {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get("refresh_token")?.value;

  if (!refreshTokenValue) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return null;
  }

  try {
    const response = await axiosClient.post("/auth/refresh", {
      refreshToken: refreshTokenValue,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data || {};

    if (!accessToken) {
      throw new Error("No access token returned from refresh endpoint");
    }

    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    if (newRefreshToken) {
      cookieStore.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return accessToken;
  } catch (error) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return null;
  }
}

export default refreshToken;
