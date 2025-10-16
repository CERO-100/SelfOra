"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Use the fallback editor by default to avoid BlockNote issues
const FallbackEditor = dynamic(() => import("./fallback-editor"), {
  ssr: false,
  loading: () => <EditorLoadingState />,
});

function EditorLoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="animate-pulse">
        {/* Header Loading */}
        <div className="px-8 py-6 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-md"></div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Content Loading */}
        <div className="px-8 py-6 space-y-6">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Footer Loading */}
        <div className="px-8 pb-6">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-5 bg-gray-200 rounded w-6"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorWrapper() {
  return (
    <div className="py-8 w-full">
      <Suspense fallback={<EditorLoadingState />}>
        <FallbackEditor />
      </Suspense>
    </div>
  );
}
