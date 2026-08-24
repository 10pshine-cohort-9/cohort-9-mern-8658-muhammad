"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";

import { getNotebyId } from "../action";
import { updateNote } from "./action";
import NoteEditor from "@/components/NoteEditor";

const initialNote = {
  title: "Untitled note",
  content: "",
  pinned: false,
  category: "Personal",
  archived: false,
  favorite: false,
  tags: [],
};

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (!id) return;

    async function loadNote() {
      const res = await getNotebyId(id);

      if (!res?.success) {
        toast.add({
          type: "error",
          description: res?.message || "Unable to load note",
        });

        return;
      }

      setNote(res.notes);
    }

    loadNote();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!id) return;

    const res = await updateNote(id, note);

    if (res.success) {
      toast.add({
        type: "success",
        description: res.message,
      });

      router.push("/app/notes");
      return;
    }

    toast.add({
      type: "error",
      description: res.message,
    });
  }

  return <NoteEditor note={note} setNote={setNote} onSubmit={handleSubmit} />;
}
