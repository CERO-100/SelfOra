"use client"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/style.css"

export default function Editor() {
  const editor = useCreateBlockNote({})

  return (
    <div className="p-4 rounded-lg border border-gray-800">
      <BlockNoteView editor={editor} theme="light" />
    </div>
  )
}
