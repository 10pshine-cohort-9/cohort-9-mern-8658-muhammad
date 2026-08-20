import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { API_URL } from "@/lib/api/axios";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  try {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return NextResponse.json(response.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        throw error;
      }
    }

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      refreshResponse.data || {};

    if (!newAccessToken) {
      throw new Error("No access token returned");
    }
    const userResponse = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    });

    const response = NextResponse.json(userResponse.data);

    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    if (newRefreshToken) {
      response.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch {
    const response = NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }
}
