"use server";
import { AxiosReq } from "@/lib/api/server-api";

export async function getfavoriteNote() {
  let api = await AxiosReq();
  try {
    const res = await api.get("/note/favorite");

    return { success: true, notes: res.data };
  } catch (error) {
    return {
      success: false,
      notes: [],
      message: error.response?.data?.message || "Unable to fetch data",
    };
  }
}
