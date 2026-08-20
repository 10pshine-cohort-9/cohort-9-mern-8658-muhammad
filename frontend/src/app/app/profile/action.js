"use server";

import { AxiosReq } from "@/lib/api/server-api";

export async function UpdateProfile(user) {
  try {
    const api = await AxiosReq();
    if (!user.name) {
      return {
        success: false,
        message: "Enter name ",
      };
    }
    const res = await api.patch("/user", user);
    return {
      success: true,
      user: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to Save",
    };
  }
}

export async function getUserStats() {
  try {
    const api = await AxiosReq();
    const res = await api.get("/user/stats");
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to Save",
    };
  }
}
