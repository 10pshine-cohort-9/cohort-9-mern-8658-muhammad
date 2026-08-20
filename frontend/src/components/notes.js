"use client";

import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Archive,
  ArchiveXIcon,
  MoreVertical,
  Pin,
  PinOffIcon,
  Star,
  Trash2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/timeAgo";
import { useRouter } from "next/navigation";

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
} from "@/components/ui/alert-dialog";

function Notes({
  id,
  title,
  category,
  content,
  tags,
  createdAt,
  favorite,
  pinned,
  archive,
  onNoteAction,
}) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleOpenNote = () => {
    router.push(`/app/notes/${id}`);
  };

  const handleDelete = () => {
    onNoteAction(id, "delete");
    setDeleteOpen(false);
  };

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenNote();
    }
  };

  return (
    <>
      <Card
        role="link"
        tabIndex={0}
        onClick={handleOpenNote}
        aria-label={`Open note: ${title}`}
        onKeyDown={handleCardKeyDown}
        className="font-sans h-64 m-2 shadow-xs transition-all duration-300
        hover:shadow-[0_10px_35px_rgba(139,92,246,0.4)]
        hover:ring-violet-300 group
        dark:bg-[#101321]
        dark:border-b-gray-800
        border-b-gray-100"
      >
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>
              <div className="flex items-center gap-3">
                {pinned && (
                  <Pin className="size-4 text-violet-700 fill-violet-700" />
                )}

                <div className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-[#1D2130] dark:text-gray-400">
                  {category}
                </div>
              </div>

              <h2 className="mt-3 text-xl">{title}</h2>
            </CardTitle>

            <CardAction>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNoteAction(id, "favorite");
                }}
                aria-label="Toggle favorite"
              >
                <Star
                  className={`size-4 ${
                    favorite
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="h-28 flex flex-col">
          <p
            className="line-clamp-2 text-gray-600 dark:text-gray-400 note-preview
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

              [&_hr]:my-6"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />

          <div className="mt-auto flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <div
                key={tag}
                className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-gray-700 dark:bg-[#2B2654] dark:text-gray-200"
              >
                #{tag}
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-0 bg-transparent mt-0 pt-0 flex justify-between">
          <p className="text-xs text-gray-700 dark:text-gray-200">
            {timeAgo(createdAt)}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              render={
                <button
                  type="button"
                  className="opacity-0 transition-all duration-200 group-hover:opacity-100"
                  aria-label="Note actions"
                >
                  <MoreVertical className="size-4 dark:text-gray-200" />
                </button>
              }
            />

            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteAction(id, "pinned");
                  }}
                >
                  {!pinned ? (
                    <>
                      <Pin />
                      Pin
                    </>
                  ) : (
                    <>
                      <PinOffIcon />
                      Unpin
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteAction(id, "archived");
                  }}
                >
                  {archive ? (
                    <>
                      <ArchiveXIcon />
                      Unarchive
                    </>
                  ) : (
                    <>
                      <Archive />
                      Archive
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-500 "
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>

            <AlertDialogTitle>Delete Note?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete this note. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Notes;
