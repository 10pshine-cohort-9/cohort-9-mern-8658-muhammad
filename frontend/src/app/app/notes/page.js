"use client";

import { useMemo, useState } from "react";
import { File, Grid2X2, List, Plus } from "lucide-react";

import Notes from "@/components/notes";
import { Button } from "@/components/ui/button";
import EmptyNoteAction from "@/components/EmptyNoteAction";

const notes = [
  {
    id: 1,
    title: "Welcome to NoteSphere ✨",
    category: "Personal",
    content:
  "Hello there! This is your first note. Try creating a new one, favorite it, or archive it to explore NoteSphere's features.",
      tags: ["intro", "welcome"],
    createdAt: "2 days ago",
    favorite: false,
    pinned: true,
  },
  {
    id: 2,
    title: "Reading List",
    category: "Learning",
    content:
      "Designing Data-Intensive Applications Shape Up. Read chapters 4-7 this week.",
    tags: ["books"],
    createdAt: "6 days ago",
    favorite: true,
    pinned: false,
  },
];

const categories = ["All", "Personal", "Work", "Ideas", "Learning", "Journal"];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridView, setGridView] = useState(true);

  const filteredNotes = useMemo(() => {
    if (selectedCategory === "All") return notes;

    return notes.filter((note) => note.category === selectedCategory);
  }, [selectedCategory]);

  let handlenewNote=()=>{
    // implement later
  }

  return (
    <div className="min-h-screen bg-[#F9FAFE] p-6 dark:bg-[#070811]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Notes</h1>

          <p className="mt-2 text-muted-foreground">
            {filteredNotes.length}{" "}
            {filteredNotes.length === 1 ? "note" : "notes"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex overflow-hidden rounded-xl border bg-white dark:bg-[#0D0F1D]">
            <button
             type="button"
              aria-label="Grid view"
              aria-pressed={gridView}
              onClick={() => setGridView(true)}
              className={`border-r p-3 transition ${
                gridView ? "bg-violet-100 text-violet-600" : "hover:bg-muted"
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
                !gridView ? "bg-violet-100 text-violet-600" : "hover:bg-muted"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button onClick={()=>(handlenewNote)} className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-6 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New note
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
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
              title={note.title}
              category={note.category}
              content={note.content}
              createdAt={note.createdAt}
              pinned={note.pinned}
              favorite={note.favorite}
              tags={note.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
