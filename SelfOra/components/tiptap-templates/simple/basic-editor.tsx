"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteViewRaw } from "@blocknote/react";
import { useState, useEffect } from "react";
import { Type, Calendar, User, Share2 } from "lucide-react";

export default function BasicEditor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <BasicEditorSkeleton />;
  }

  return <ClientBasicEditor />;
}

function BasicEditorSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="animate-pulse p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-72"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

function ClientBasicEditor() {
  const [title, setTitle] = useState("Untitled Document");

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to your document. Start typing to begin writing...",
      },
    ],
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Document Header */}
        <div className="px-8 py-6 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Type size={18} className="text-white" />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
                placeholder="Document title..."
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>Edited by you</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-8">
          <style jsx global>{`
            .basic-editor .ProseMirror {
              outline: none;
              font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont,
                "Segoe UI", Helvetica, Arial, sans-serif;
              font-size: 16px;
              line-height: 1.7;
              color: #374151;
            }

            .basic-editor .ProseMirror h1 {
              font-size: 2.25em;
              font-weight: 700;
              margin: 1.5em 0 0.5em 0;
              color: #111827;
            }

            .basic-editor .ProseMirror h2 {
              font-size: 1.75em;
              font-weight: 600;
              margin: 1.25em 0 0.5em 0;
              color: #111827;
            }

            .basic-editor .ProseMirror h3 {
              font-size: 1.375em;
              font-weight: 600;
              margin: 1em 0 0.5em 0;
              color: #111827;
            }

            .basic-editor .ProseMirror p {
              margin: 0.75em 0;
            }

            .basic-editor .ProseMirror ul,
            .basic-editor .ProseMirror ol {
              padding-left: 1.5em;
              margin: 0.75em 0;
            }

            .basic-editor .ProseMirror li {
              margin: 0.25em 0;
            }

            .basic-editor .ProseMirror blockquote {
              border-left: 4px solid #e5e7eb;
              padding-left: 1em;
              margin: 1em 0;
              color: #6b7280;
              font-style: italic;
            }

            .basic-editor .ProseMirror code {
              background: #f3f4f6;
              padding: 0.125em 0.25em;
              border-radius: 0.25em;
              font-family: ui-monospace, "Cascadia Code", "Segoe UI Mono",
                monospace;
              font-size: 0.875em;
            }

            .basic-editor .ProseMirror pre {
              background: #1f2937;
              color: #f9fafb;
              padding: 1em;
              border-radius: 0.5em;
              overflow-x: auto;
              margin: 1em 0;
            }

            .basic-editor .ProseMirror pre code {
              background: transparent;
              padding: 0;
              color: inherit;
            }
          `}</style>

          <div className="basic-editor">
            <BlockNoteViewRaw
              editor={editor}
              className="min-h-[500px] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>Press</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">
                /
              </kbd>
              <span>for commands</span>
            </div>
            <div>{new Date().toLocaleTimeString()} • Auto-saved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
