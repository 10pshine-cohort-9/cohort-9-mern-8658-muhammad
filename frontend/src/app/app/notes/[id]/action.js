"use server";

import { AxiosReq } from "@/lib/api/server-api";

export async function getNotebyId(id) {
  const api = await AxiosReq();

  try {
    const res = await api.get(`/note/${id}`);

    return {
      success: true,
      notes: res.data,
    };
  } catch (error) {
    return {
      success: false,
      notes: null,
      message: error.response?.data?.message || "Unable to fetch note",
    };
  }
}
