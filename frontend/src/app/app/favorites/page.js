"use client";

import { Star } from "lucide-react";
import Notes from "@/components/notes";

const notes = [
  {
    id: 1,
    title: "Welcome to NoteSphere ✨",
    category: "Personal",
    content:
      "Hello there! This is your first note. Try creating a new one, favorite it, or archive it.",
    tags: ["intro", "welcome"],
    createdAt: "2 days ago",
    favorite: true,
    pinned: true,
  },
  {
    id: 2,
    title: "Reading list",
    category: "Learning",
    content:
      "Designing Data-Intensive Applications Shape Up",
    tags: ["books"],
    createdAt: "6 days ago",
    favorite: false,
    pinned: false,
  },
];

function Page() {


  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] p-6 font-sans">
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

          <h2 className="mt-6 text-3xl font-bold">
            No favorite notes yet
          </h2>

          <p className="mt-2 text-muted-foreground">
            Star a note to see it appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favoriteNotes.map((note) => (
            <Notes
              key={note.id}
              title={note.title}
              category={note.category}
              content={note.content}
              tags={note.tags}
              createdAt={note.createdAt}
              favorite={note.favorite}
              pinned={note.pinned}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default Page