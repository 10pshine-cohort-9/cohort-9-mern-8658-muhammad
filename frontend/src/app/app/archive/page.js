"use client";

import { Archive } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import Notes from "@/components/notes";
import {
  archievedNote,
  deleteNote,
  favoriteNote,
  pinnedNote,
} from "../notes/action";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { getArchivedNote } from "./action";
import { useRouter } from "next/navigation";

function page() {
  const [archivedNotes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let getAllNotes = async () => {
      const res = await getArchivedNote();
      if (!res.success) {
        toast.add({ type: "error", description: res.message });
      }
      setNotes(res.notes);
    };
    getAllNotes();
  }, []);

  let handleToggle = async (id, action) => {
    try {
      let res;

      if (action === "favorite") {
        res = await favoriteNote(id);
      } else if (action === "pinned") {
        res = await pinnedNote(id);
      } else if (action === "archived") {
        res = await archievedNote(id);
      } else if (action === "delete") {
        res = await deleteNote(id);
      } else {
        return;
      }

      if (!res?.success) {
        toast.add({
          type: "error",
          description: res?.message || "Something went wrong",
        });

        return;
      }

      if (action === "delete" || action === "archived") {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        return;
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === res.notes.id ? res.notes : note)),
      );
    } catch (error) {
      toast.add({
        type: "error",
        description: error?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] px-3 sm:px-6 py-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Archive
        </h1>

        <p className="mt-2 text-muted-foreground">
          {archivedNotes.length} archived{" "}
          {archivedNotes.length === 1 ? "note" : "notes"}
        </p>
      </div>

      {archivedNotes.length === 0 ? (
        <Card className="mt-8 border border-dashed bg-[#FCFDFF] dark:bg-[#0D0F1D] rounded-3xl shadow-none">
          <CardContent className="flex h-[420px] flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 to-sky-500">
              <Archive className="h-8 w-8 text-white" />
            </div>

            <h2 className="mt-6 text-nowrap text-xl sm:text-2xl md:text-3xl font-bold">
              Archive is empty
            </h2>

            <p className="mt-2 text-center text-muted-foreground">
              Archived notes will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archivedNotes.map((note) => (
            <Notes
              key={note.id}
              id={note.id}
              title={note.title}
              category={note.category}
              content={note.content}
              tags={note.tags}
              createdAt={note.createdAt}
              archive={note.archived}
              favorite={note.favorite}
              pinned={note.pinned}
              onNoteAction={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default page;
