"use server";
import { AxiosReq } from "@/lib/api/server-api";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  let api = await AxiosReq();
  try {
    const res = await api.get("/note");

    return { success: true, notes: res.data };
  } catch (error) {
    return {
      success: false,
      notes: [],
      message: error.response?.data?.message || "Unable to fetch data",
    };
  }
}

export async function favoriteNote(id) {
  let api = await AxiosReq();

  try {
    const res = await api.patch(`/note/${id}/favorite`);

    return { success: true, notes: res.data.note };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch data",
    };
  }
}

export async function pinnedNote(id) {
  let api = await AxiosReq();

  try {
    const res = await api.patch(`/note/${id}/pinned`);

    return { success: true, notes: res.data.note };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch data",
    };
  }
}

export async function archievedNote(id) {
  let api = await AxiosReq();

  try {
    const res = await api.patch(`/note/${id}/archived`);

    return { success: true, notes: res.data.note };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch data",
    };
  }
}

export async function deleteNote(id) {
  const api = await AxiosReq();

  try {
    const res = await api.delete(`/note/${id}`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to delete note",
    };
  }
}
