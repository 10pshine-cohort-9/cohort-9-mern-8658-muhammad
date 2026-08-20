"use server";

import { AxiosReq } from "@/lib/api/server-api";

export async function DashboardData() {
  try {
    const api = await AxiosReq();
    const res = await api.get("/user/dashboard");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to load data",
    };
  }
}
