import React from "react";
import { Button } from "./ui/button";
import { File, Plus } from "lucide-react";
import Link from "next/link";

function EmptyNoteAction() {
  return (
    <div className="mt-6 flex h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed bg-[#FBFDFF] dark:bg-[#0D0F1D]">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 to-sky-500">
        <File className="h-8 w-8 text-white" />
      </div>

      <h2 className="mt-6 text-xl sm:text-2xl md:text-3xl font-bold">
        No notes here yet
      </h2>

      <p className="mt-2 text-sm text-center text-muted-foreground">
        Create your first note and it will appear right here.
      </p>

      <Link href={"/app/notes/new"}>
        <Button
          onClick={() => {}}
          className="mt-6 rounded-full bg-gradient-to-r from-violet-500 to-sky-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create note
        </Button>
      </Link>
    </div>
  );
}

export default EmptyNoteAction;
