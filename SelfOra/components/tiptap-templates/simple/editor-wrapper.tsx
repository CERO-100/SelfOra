"use client";

import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("./simple-editor"), {
  ssr: false,
  loading: () => (
    <div className="p-4 rounded-lg border border-gray-800 animate-pulse">
      <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    </div>
  ),
});

export default function EditorWrapper() {
  return <DynamicEditor />;
}
