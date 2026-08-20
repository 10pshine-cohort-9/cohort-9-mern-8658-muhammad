"use server";

import { AxiosReq } from "@/lib/api/server-api";

export async function updateNote(id, note) {
  try {
    const api = await AxiosReq();
    console.log(note);
    const isEmpty =
      !note.content || note.content.replace(/<[^>]*>/g, "").trim() === "";

    if (isEmpty) {
      return {
        success: false,
        message: "Note content is empty",
      };
    }

    const res = await api.patch(`/note/${id}`, {
      title: note.title,
      content: note.content,
      pinned: note.pinned,
      category: note.category,
      archived: note.archived,
      favorite: note.favorite,
      tags: note.tags,
    });
    return {
      success: true,
      notes: res.data,
      message: "Updated",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to Update",
    };
  }
}
