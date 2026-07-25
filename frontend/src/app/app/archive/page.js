
"use client";

import { Archive } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import Notes from "@/components/notes";

const archivedNotes = [
  
//   {
//     id: 1,
//     title: "Old Meeting Notes",
//     category: "Work",
//     content: "Discussion about Q2 roadmap...",
//     tags: ["meeting", "work"],
//     createdAt: "2 weeks ago",
//     favorite: false,
//     pinned: false,
//   },
];
function page() {
  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Archive</h1>

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

            <h2 className="mt-6 text-3xl font-bold">
              Archive is empty
            </h2>

            <p className="mt-2 text-muted-foreground">
              Archived notes will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archivedNotes.map((note) => (
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

export default page