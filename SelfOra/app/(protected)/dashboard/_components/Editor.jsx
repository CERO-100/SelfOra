"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, LinkIcon, ImageIcon } from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex gap-2 border-b p-2 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "font-bold text-blue-600" : ""}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "italic text-blue-600" : ""}
      >
        <Italic size={18} />
      </button>
      <button onClick={addLink}>
        <LinkIcon size={18} />
      </button>
      <button onClick={addImage}>
        <ImageIcon size={18} />
      </button>
    </div>
  );
};

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Type something amazing...",
      }),
    ],
    content: "<p>Start writing here...</p>",
  });

  return (
    <div className="max-w-3xl mx-auto border rounded-lg shadow-sm bg-white">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] outline-none prose max-w-none"
      />
    </div>
  );
};

export default Editor;
