"use client";

import { useEffect, useMemo, useState } from "react";
import { Grid2X2, List, Plus } from "lucide-react";

import Notes from "@/components/notes";
import { Button } from "@/components/ui/button";
import EmptyNoteAction from "@/components/EmptyNoteAction";
import {
  archievedNote,
  deleteNote,
  favoriteNote,
  getNotes,
  pinnedNote,
} from "./action";
import { toast } from "@/components/ui/toast";
import Link from "next/link";

const categories = ["All", "Personal", "Work", "Ideas", "Learning", "Journal"];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notes, setNotes] = useState([]);
  const [gridView, setGridView] = useState(true);

  useEffect(() => {
    const getAllNotes = async () => {
      try {
        const res = await getNotes();

        if (!res?.success) {
          toast.add({
            type: "error",
            description: res?.message || "Unable to load notes",
          });
          setNotes([]);
          return;
        }

        setNotes(res.notes || []);
      } catch (error) {
        console.error("Get notes error:", error);

        setNotes([]);

        toast.add({
          type: "error",
          description: "Unable to load notes",
        });
      }
    };

    getAllNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    if (selectedCategory === "All") return notes;

    return notes.filter((note) => note.category === selectedCategory);
  }, [selectedCategory, notes]);

  const handleToggle = async (id, action) => {
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

      if (action === "delete") {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        return;
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === res.notes.id ? res.notes : note)),
      );
    } catch (error) {
      console.error("Note action error:", error);

      toast.add({
        type: "error",
        description: "Unable to update note",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFE] px-3 sm:px-6 py-6 dark:bg-[#070811]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Notes</h1>

          <p className="mt-2 text-muted-foreground">
            {filteredNotes.length}{" "}
            {filteredNotes.length === 1 ? "note" : "notes"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex overflow-hidden rounded-xl border bg-white dark:bg-[#0D0F1D]">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={gridView}
              onClick={() => setGridView(true)}
              className={`border-r p-3 transition ${
                gridView
                  ? "bg-violet-100 text-violet-600 dark:bg-gray-700"
                  : "hover:bg-muted"
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="List view"
              aria-pressed={!gridView}
              onClick={() => setGridView(false)}
              className={`p-3 transition ${
                !gridView
                  ? "bg-violet-100 text-violet-600 dark:bg-gray-700"
                  : "hover:bg-muted"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Link href={"/app/notes/new"}>
            <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-1 sm:px-4 py-6 text-white">
              <Plus className="sm:mr-2 h-4 w-4" />
              New note
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex  gap-3 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full border px-5 py-2 text-sm transition ${
              selectedCategory === category
                ? "bg-gradient-to-r from-violet-500 to-sky-500 text-white"
                : "bg-white hover:bg-violet-50 dark:bg-[#0D0F1D]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredNotes.length === 0 ? (
        <EmptyNoteAction />
      ) : (
        <div
          className={`mt-6 grid gap-5 ${
            gridView ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {filteredNotes.map((note) => (
            <Notes
              key={note.id}
              id={note.id}
              title={note.title}
              category={note.category}
              content={note.content}
              createdAt={note.createdAt}
              pinned={note.pinned}
              favorite={note.favorite}
              archive={note.archived}
              tags={note.tags}
              onNoteAction={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
