"use server";

import { AxiosReq } from "@/lib/api/server-api";

async function addNote(note) {
  const api = await AxiosReq();
  try {
    const isEmpty =
      !note.content || note.content.replace(/<[^>]*>/g, "").trim() === "";

    if (isEmpty) {
      return {
        success: false,
        message: "Note content is empty",
      };
    }
    const res = await api.post("/note", note);
    console.log(res);

    return { success: true, message: "Notes Created" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error while creating a note",
    };
  }
}
export default addNote;
