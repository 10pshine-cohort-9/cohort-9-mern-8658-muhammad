"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

export default function RichTextEditor({ onChange, content }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],

    content: content || "",

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== (content || "")) {
      editor.commands.setContent(content || "", false);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-[#f5f7ff] dark:bg-[#090a17] shadow-sm">
      <EditorToolbar editor={editor} />

      <EditorContent
        editor={editor}
        className="
          min-h-[400px] 
          p-6

          [&_.tiptap]:min-h-[350px]
          [&_.tiptap]:outline-none

          [&_.tiptap_p]:my-3

          [&_.tiptap_h1]:mb-4
          [&_.tiptap_h1]:text-3xl
          [&_.tiptap_h1]:font-bold

          [&_.tiptap_h2]:mb-3
          [&_.tiptap_h2]:text-2xl
          [&_.tiptap_h2]:font-semibold

          [&_.tiptap_h3]:mb-2
          [&_.tiptap_h3]:text-xl
          [&_.tiptap_h3]:font-semibold

          [&_.tiptap_ul]:my-3
          [&_.tiptap_ul]:list-disc
          [&_.tiptap_ul]:pl-6

          [&_.tiptap_ol]:my-3
          [&_.tiptap_ol]:list-decimal
          [&_.tiptap_ol]:pl-6

          [&_.tiptap_blockquote]:my-4
          [&_.tiptap_blockquote]:border-l-4
          [&_.tiptap_blockquote]:pl-4
          [&_.tiptap_blockquote]:italic

          [&_.tiptap_pre]:my-4
          [&_.tiptap_pre]:overflow-x-auto
          [&_.tiptap_pre]:rounded-lg
          [&_.tiptap_pre]:bg-[#181b2a]
          [&_.tiptap_pre]:p-4
          [&_.tiptap_pre]:text-white

          [&_.tiptap_code]:rounded
          [&_.tiptap_code]:bg-muted
          [&_.tiptap_code]:px-1.5
          [&_.tiptap_code]:py-0.5

          [&_.tiptap_a]:text-violet-500
          [&_.tiptap_a]:underline

          [&_.tiptap_hr]:my-6
        "
      />
    </div>
  );
}
