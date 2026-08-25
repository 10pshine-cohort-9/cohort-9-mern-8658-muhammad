"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";
import addNote from "./action";
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

export default function NewNotePage() {
  const router = useRouter();

  const [note, setNote] = useState(initialNote);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const res = await addNote(note);

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
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error ? error.message : "Unable to create note",
      });
    } finally {
      setSubmitting(false);
    }
  }
  return <NoteEditor note={note} setNote={setNote} onSubmit={handleSubmit} />;
}
