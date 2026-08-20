"use client";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  children,
  label,
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          "inline-flex h-8 w-8 shrink-0 items-center justify-center",
          "rounded-md text-sm font-medium",
          "transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        ].join(" ")}
      >
        {children}
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-background px-2 py-1.5">
      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => {
          editor.chain().focus().undo().run();
        }}
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => {
          editor.chain().focus().redo().run();
        }}
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Heading1 className="h-4 w-4" />
          <span className="hidden sm:inline">Heading</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Paragraph
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 className="mr-2 h-4 w-4" />
            Heading 1
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="mr-2 h-4 w-4" />
            Heading 2
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="mr-2 h-4 w-4" />
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        label="Align left"
        active={editor.isActive({
          textAlign: "left",
        })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Align center"
        active={editor.isActive({
          textAlign: "center",
        })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Align right"
        active={editor.isActive({
          textAlign: "right",
        })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
