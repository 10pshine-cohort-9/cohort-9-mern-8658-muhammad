"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";

import { getNotebyId } from "../action";
import { updateNote } from "./action";
import NoteEditor from "@/components/NoteEditor";
import EditorSkeleton from "@/components/EditorSkeleton";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setLoadFailed(true);
      return;
    }

    let mounted = true;

    async function loadNote() {
      try {
        const res = await getNotebyId(id);

        if (!mounted) return;

        if (!res?.success || !res.notes) {
          setLoadFailed(true);
          toast.add({
            type: "error",
            description: res?.message || "Unable to load note",
          });
          return;
        }

        setNote(res.notes);
      } catch (error) {
        if (!mounted) return;

        setLoadFailed(true);
        toast.add({
          type: "error",
          description:
            error instanceof Error ? error.message : "Unable to load note",
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadNote();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!id) return;

    try {
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
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error ? error.message : "Unable to update note",
      });
    }
  }

  if (loading) {
    return <EditorSkeleton />;
  }

  if (loadFailed) {
    return (
      <div className="min-h-screen bg-[#F9FAFE] p-6 dark:bg-[#070811]">
        <div className="mx-auto max-w-7xl">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <ArrowLeft />
            Back
          </Button>

          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold">Note not found</h1>

            <p className="mt-2 text-muted-foreground">
              This note may have been deleted or does not exist.
            </p>

            <Button
              onClick={() => router.push("/notes")}
              className="mt-5 rounded-xl"
            >
              Go to notes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <NoteEditor note={note} setNote={setNote} onSubmit={handleSubmit} />;
}
