"use client";

import RichTextEditor from "@/components/Tiptap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldTitle } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { Archive, Code2Icon, Eye, Pin, Save, Star } from "lucide-react";

import Link from "next/link";
import { useState } from "react";

let CATEGORIES = ["Personal", "Work", "Learning", "Ideas", "Journal"];

export default function NoteEditor({
  note,
  setNote,
  onSubmit,
  submitLabel = "Save",
}) {
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddTag() {
    const tag = tagInput.trim();

    if (!tag) return;

    if (note.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setNote((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  }

  function toggleField(field) {
    setNote((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

  return (
    <div className="min-h-screen bg-[#F9FAFE] px-3 py-6 dark:bg-[#070811] sm:px-6">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col justify-between md:flex-row">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Note Editor</h1>

            <p className="mt-2 text-muted-foreground">
              All the changes are saved automatically
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3 sm:mt-0">
            <Button
              type="button"
              variant="outline"
              className="py-4"
              onClick={() => setPreview((value) => !value)}
            >
              {!preview ? (
                <>
                  <Eye className="size-4" />
                  Preview
                </>
              ) : (
                <>
                  <Code2Icon />
                  Edit
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className={`py-4 hover:bg-gray-200 hover:dark:bg-gray-800 ${
                note.archived && "bg-gray-200 dark:bg-gray-800"
              }`}
              onClick={() => toggleField("archived")}
            >
              <Archive className="size-4" />
              Archive
            </Button>

            <Link href="/app/notes">
              <Button variant="outline" type="button" className="py-4">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="outline"
              className="bg-gradient-to-br from-violet-500 to-sky-500 p-4 text-white"
            >
              <Save className="size-4" />
              {submitLabel}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
          <div className="mt-8 md:col-span-7">
            {!preview ? (
              <>
                <input
                  value={note.title}
                  name="title"
                  onChange={handleChange}
                  placeholder="Note title..."
                  className="mb-3 h-10 border-0 text-3xl font-bold shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                />

                <RichTextEditor
                  content={note.content}
                  onChange={(content) =>
                    setNote((prev) => ({
                      ...prev,
                      content,
                    }))
                  }
                />
              </>
            ) : (
              <div>
                <h1 className="mb-6 text-3xl font-bold">{note.title}</h1>

                <Card className="min-h-60 overflow-hidden dark:bg-[#101321]">
                  <CardContent className="pt-6">
                    <div
                      className="
                        note-preview
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
              </div>
            )}
          </div>

          <div className="mt-4 lg:mt-8 md:col-span-3">
            <Card className="my-3 dark:bg-[#101321]">
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>

              <CardContent>
                <Card className="bg-[#F9FAFE] dark:bg-[#070811]">
                  <CardContent>
                    <Field orientation="Horizontal">
                      <FieldContent>
                        <FieldTitle>
                          <Pin className="size-4 text-violet-700" />
                          Pin to Top
                        </FieldTitle>
                      </FieldContent>

                      <Switch
                        checked={note.pinned}
                        onCheckedChange={(checked) =>
                          setNote((prev) => ({
                            ...prev,
                            pinned: checked,
                          }))
                        }
                      />
                    </Field>
                  </CardContent>
                </Card>

                <Card className="mt-3 bg-[#F9FAFE] dark:bg-[#070811]">
                  <CardContent>
                    <Field orientation="Horizontal">
                      <FieldContent>
                        <FieldTitle>
                          <Star className="size-4 text-violet-700" />
                          Favorite
                        </FieldTitle>
                      </FieldContent>

                      <Switch
                        checked={note.favorite}
                        onCheckedChange={(checked) =>
                          setNote((prev) => ({
                            ...prev,
                            favorite: checked,
                          }))
                        }
                      />
                    </Field>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card className="my-3 dark:bg-[#101321]">
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>

              <CardContent>
                <Select
                  items={CATEGORIES}
                  value={note.category}
                  onValueChange={(value) =>
                    setNote((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Category</SelectLabel>

                      {CATEGORIES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="mt-3 dark:bg-[#101321]">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                  <input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    placeholder="Add tag..."
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-violet-500/50 dark:bg-[#070811]"
                  />

                  <Button
                    type="button"
                    onClick={handleAddTag}
                    className="h-10 rounded-lg bg-gradient-to-br from-violet-500 to-sky-500 px-4 text-white hover:opacity-90"
                  >
                    Add
                  </Button>
                </div>

                {note.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <div
                        key={tag}
                        className="rounded-md bg-violet-500/10 px-2.5 py-1 text-sm text-violet-600 dark:text-violet-400"
                      >
                        #{tag}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
