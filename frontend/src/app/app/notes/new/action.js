"use server";

import { AxiosReq } from "@/lib/api/server-api";

async function addNote(note) {
  try {
    const api = await AxiosReq();
    // NOSONAR - Tiptap HTML content is stripped here intentionally
    const isEmpty =
      !note.content || note.content.replace(/<[^>]+>/g, "").trim() === "";

    if (isEmpty) {
      return {
        success: false,
        message: "Note content is empty",
      };
    }
    await api.post("/note", note);

    return { success: true, message: "Notes Created" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error while creating a note",
    };
  }
}
export default addNote;
