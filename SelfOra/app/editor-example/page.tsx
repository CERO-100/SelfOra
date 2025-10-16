"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { type JSONContent } from "novel";

// Dynamic import to avoid SSR issues
const Editor = dynamic(() => import("@/components/editor/simple-editor"), {
  ssr: false,
});

export default function EditorExamplePage() {
  const [content, setContent] = useState<string>("");

  const handleContentChange = (html: string) => {
    setContent(html);
    console.log("Editor content updated:", html);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Advanced Rich Text Editor</h1>
      <p className="text-muted-foreground mb-8">
        A Notion-style editor with slash commands, formatting options, and more.
      </p>

      <div className="mb-8">
        <Editor onChange={handleContentChange} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Features:</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Slash commands (type / to see all options)</li>
          <li>Text formatting (bold, italic, underline, strikethrough)</li>
          <li>Headings (H1, H2, H3)</li>
          <li>Lists (bullet, numbered, to-do)</li>
          <li>Blockquotes and code blocks</li>
          <li>Color and highlight options</li>
          <li>Link insertion</li>
          <li>Image upload</li>
          <li>YouTube and Twitter embeds</li>
        </ul>
      </div>

      {content && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Preview:</h2>
          <div
            className="prose dark:prose-invert max-w-full p-4 border rounded-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
}
