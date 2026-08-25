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

  async function handleSubmit(event) {
    event.preventDefault();

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
  }

  return <NoteEditor note={note} setNote={setNote} onSubmit={handleSubmit} />;
}
