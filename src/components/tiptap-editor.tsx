"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useThemeStore } from "@/store/theme-store";

interface TiptapEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () =>
    editor.chain().focus().toggleBlockquote().run();

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const buttonClass = (isActive: boolean) =>
    `px-3 py-1 rounded text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-foreground hover:bg-input"
    }`;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-card border border-border rounded-t-lg">
      <button
        onClick={toggleBold}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold (Ctrl+B)"
      >
        B
      </button>
      <button
        onClick={toggleItalic}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic (Ctrl+I)"
      >
        I
      </button>
      <button
        onClick={toggleCode}
        className={buttonClass(editor.isActive("code"))}
        title="Code"
      >
        {"<>"}
      </button>

      <div className="border-r border-border"></div>

      <button
        onClick={() => toggleHeading(1)}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => toggleHeading(2)}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => toggleHeading(3)}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        title="Heading 3"
      >
        H3
      </button>

      <div className="border-r border-border"></div>

      <button
        onClick={toggleBulletList}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={toggleOrderedList}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Ordered List"
      >
        1. List
      </button>
      <button
        onClick={toggleCodeBlock}
        className={buttonClass(editor.isActive("codeBlock"))}
        title="Code Block"
      >
        Code
      </button>
      <button
        onClick={toggleBlockquote}
        className={buttonClass(editor.isActive("blockquote"))}
        title="Blockquote"
      >
        Quote
      </button>

      <div className="border-r border-border"></div>

      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        className={buttonClass(false)}
        title="Clear Formatting"
      >
        Clear
      </button>
    </div>
  );
};

export const TiptapEditor = ({
  value = "",
  onChange,
  placeholder = "Write your post...",
  readOnly = false,
}: TiptapEditorProps) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: true }),
      Image,
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!mounted) return null;

  return (
    <div
      className={`border border-border rounded-lg overflow-hidden ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {!readOnly && <MenuBar editor={editor} />}
      <div className="bg-card text-card-foreground">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none prose-sm px-4 py-3 focus:outline-none min-h-64"
        />
      </div>
    </div>
  );
};
