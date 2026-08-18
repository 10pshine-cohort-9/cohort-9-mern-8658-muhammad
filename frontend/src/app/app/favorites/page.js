"use client";

import { Star } from "lucide-react";
import Notes from "@/components/notes";
import { useEffect, useState } from "react";
import { getfavoriteNote } from "./action";
import {
  archievedNote,
  deleteNote,
  favoriteNote,
  pinnedNote,
} from "../notes/action";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

function Page() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  const favoriteNotes = notes.filter((note) => note.favorite);

  useEffect(() => {
    let getAllNotes = async () => {
      const res = await getfavoriteNote();
      if (!res.success) {
        toast.add({ type: "error", description: res.message });
      }
      setNotes(res.notes);
    };
    getAllNotes();
  }, []);

  let handleToggle = async (id, action) => {
    let res;
    if (action === "favorite") {
      res = await favoriteNote(id);
    } else if (action === "pinned") {
      res = await pinnedNote(id);
    } else if (action === "archived") {
      res = await archievedNote(id);
    } else if (action === "delete") {
      res = await deleteNote(id);
      router.refresh();
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
    if (action === "delete") {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      return;
    }
    setNotes((prev) =>
      prev.map((note) => (note.id === res.notes.id ? res.notes : note)),
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] px-3 sm:px-6 py-6 font-sans">
      <h1 className="text-2xl md:text-3xl  font-bold">Favorites</h1>

      <p className="mt-2 text-muted-foreground">
        {favoriteNotes.length} starred{" "}
        {favoriteNotes.length === 1 ? "note" : "notes"}
      </p>

      {favoriteNotes.length === 0 ? (
        <div className="mt-8 flex h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed bg-white dark:bg-[#0D0F1D]">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500">
            <Star className="h-8 w-8 fill-white text-white" />
          </div>

          <h2 className="mt-6 text-xl text-center sm:text-2xl md:text-3xl font-bold">
            No favorite notes yet
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Star a note to see it appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favoriteNotes.map((note) => (
            <Notes
              key={note.id}
              id={note.id}
              title={note.title}
              category={note.category}
              content={note.content}
              tags={note.tags}
              createdAt={note.createdAt}
              favorite={note.favorite}
              pinned={note.pinned}
              archive={note.archived}
              onNoteAction={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default Page;
