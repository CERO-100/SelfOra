"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import your editor component
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function DashboardHome() {
  const [content, setContent] = useState("");

  // Optionally, load initial content from your backend here

  return (
    <div>
      <Editor onChange={setContent} initialContent={content} editable />
      {/* You can add a save button or auto-save logic here */}
    </div>
  );
}
