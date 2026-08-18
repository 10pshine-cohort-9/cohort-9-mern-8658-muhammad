"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Archive,
  ArchiveX,
  Edit,
  Pin,
  PinOff,
  Star,
  Trash2,
} from "lucide-react";

import { archievedNote, deleteNote, favoriteNote, pinnedNote } from "../action";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/timeAgo";
import { getNotebyId } from "./action";

import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NoteDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function loadNote() {
      try {
        setLoading(true);

        const res = await getNotebyId(id);
        console.log(res);

        if (!mounted) return;

        if (!res?.success) {
          toast.add({
            type: "error",
            description: res?.message || "Unable to load note",
          });

          setNote(null);
          return;
        }

        setNote(res.notes);
      } catch (error) {
        console.error("Load note error:", error);

        if (mounted) {
          toast.add({
            type: "error",
            description: "Something went wrong while loading the note",
          });

          setNote(null);
        }
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

  async function handleAction(action) {
    if (!note || !id || actionLoading) return;

    try {
      setActionLoading(true);

      let res;

      switch (action) {
        case "favorite":
          res = await favoriteNote(id);
          break;

        case "pinned":
          res = await pinnedNote(id);
          break;

        case "archived":
          res = await archievedNote(id);
          break;

        default:
          return;
      }

      if (!res?.success) {
        toast.add({
          type: "error",
          description: res?.message || "Something went wrong",
        });

        return;
      }

      const updatedNote = res.notes;

      if (updatedNote) {
        setNote(updatedNote);
      }

      toast.add({
        type: "success",
        description:
          action === "favorite"
            ? note.favorite
              ? "Removed from favorites"
              : "Added to favorites"
            : action === "pinned"
              ? note.pinned
                ? "Note unpinned"
                : "Note pinned"
              : note.archived
                ? "Note restored"
                : "Note archived",
      });
    } catch (error) {
      console.error("Note action error:", error);

      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!note || !id || actionLoading) return;

    try {
      setActionLoading(true);

      const res = await deleteNote(id);

      if (!res?.success) {
        toast.add({
          type: "error",
          description: res?.message || "Unable to delete note",
        });

        return;
      }

      toast.add({
        type: "success",
        description: "Note deleted successfully",
      });

      router.push("/app/notes");
    } catch (error) {
      console.error("Delete note error:", error);

      toast.add({
        type: "error",
        description: "Unable to delete note",
      });
    } finally {
      setActionLoading(false);
    }
  }

  function handleEdit() {
    router.push(`/app/notes/${id}/edit`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFE] p-4 dark:bg-[#070811] sm:p-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-8 w-60 rounded-lg bg-gray-200 dark:bg-gray-800" />

          <div className="mt-6 flex flex-wrap gap-2">
            <div className="h-10 w-20 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-20 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-28 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="h-[400px] rounded-3xl bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-6">
              <div className="h-36 rounded-3xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-28 rounded-3xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
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

  return (
    <div className="min-h-screen bg-[#F9FAFE] p-4 dark:bg-[#070811] sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:justify-between items-end gap-5">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
              {note.title || "Untitled note"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {note.category || "Personal"}
              <span className="mx-1">·</span>
              updated {timeAgo(note.updatedAt || note.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 ">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="rounded-xl bg-white dark:bg-[#101321]"
            >
              <ArrowLeft />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <Button
              variant="outline"
              disabled={actionLoading}
              onClick={() => handleAction("pinned")}
              className="rounded-xl bg-white dark:bg-[#101321]"
            >
              {note.pinned ? (
                <>
                  <PinOff className="text-violet-500" />
                  <span className="hidden sm:inline">Unpin</span>
                </>
              ) : (
                <>
                  <Pin />
                  <span className="hidden sm:inline">Pin</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              disabled={actionLoading}
              onClick={() => handleAction("favorite")}
              className="rounded-xl bg-white dark:bg-[#101321]"
            >
              <Star
                className={
                  note.favorite ? "fill-yellow-400 text-yellow-400" : ""
                }
              />

              <span className="hidden sm:inline">
                {note.favorite ? "Unfavorite" : "Favorite"}
              </span>
            </Button>

            <Button
              variant="outline"
              disabled={actionLoading}
              onClick={() => handleAction("archived")}
              className="rounded-xl bg-white dark:bg-[#101321]"
            >
              {note.archived ? (
                <>
                  <ArchiveX />
                  <span className="hidden sm:inline">Unarchive</span>
                </>
              ) : (
                <>
                  <Archive />
                  <span className="hidden sm:inline">Archive</span>
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="rounded-xl border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 dark:border-red-900 dark:bg-red-950/30"
                  >
                    <Trash2 />

                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                }
              />
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this note
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={actionLoading}
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              disabled={actionLoading}
              onClick={handleEdit}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white"
            >
              <Edit />

              <span className="hidden sm:inline">Edit</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Card className="min-h-[300px] rounded-3xl border bg-white shadow-sm dark:border-gray-800 dark:bg-[#101321] sm:min-h-[400px]">
            <CardContent className="p-6 sm:p-8">
              <div
                className="
                  note-content
                  break-words
                  text-[15px]
                  leading-7
                  text-gray-800
                  dark:text-gray-200

                  [&_p]:my-3

                  [&_h1]:mb-4
                  [&_h1]:text-3xl
                  [&_h1]:font-bold

                  [&_h2]:mb-3
                  [&_h2]:text-2xl
                  [&_h2]:font-semibold

                  [&_h3]:mb-2
                  [&_h3]:text-xl
                  [&_h3]:font-semibold

                  [&_ul]:my-3
                  [&_ul]:list-disc
                  [&_ul]:pl-6

                  [&_ol]:my-3
                  [&_ol]:list-decimal
                  [&_ol]:pl-6

                  [&_blockquote]:my-4
                  [&_blockquote]:border-l-4
                  [&_blockquote]:border-violet-500
                  [&_blockquote]:pl-4
                  [&_blockquote]:italic

                  [&_pre]:my-4
                  [&_pre]:overflow-x-auto
                  [&_pre]:rounded-lg
                  [&_pre]:bg-[#181b2a]
                  [&_pre]:p-4
                  [&_pre]:text-white

                  [&_code]:rounded
                  [&_code]:bg-muted
                  [&_code]:px-1.5
                  [&_code]:py-0.5

                  [&_a]:text-violet-500
                  [&_a]:underline

                  [&_hr]:my-6
                "
                dangerouslySetInnerHTML={{
                  __html: note.content || "",
                }}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border bg-white shadow-sm dark:border-gray-800 dark:bg-[#101321]">
              <CardContent className="p-5">
                <h2 className="font-semibold">Details</h2>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Category
                    </span>

                    <span className="text-right text-sm font-medium">
                      {note.category || "Personal"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>

                    <span className="text-right text-sm font-medium">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Updated
                    </span>

                    <span className="text-right text-sm font-medium">
                      {formatDateTime(note.updatedAt || note.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-white shadow-sm dark:border-gray-800 dark:bg-[#101321]">
              <CardContent className="p-5">
                <h2 className="font-semibold">Tags</h2>

                {Array.isArray(note.tags) && note.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No tags yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
