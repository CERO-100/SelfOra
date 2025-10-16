/* eslint-disable */
"use client";

import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import type {
  Block,
  BlockEditorProps,
  PageItemLite,
} from "./BlockEditor.types";
import dynamic from "next/dynamic";

// DnD components must be client-side only
const DragDropContext = dynamic(
  () => import("@hello-pangea/dnd").then((m) => m.DragDropContext),
  { ssr: false }
);
const Droppable = dynamic(
  () => import("@hello-pangea/dnd").then((m) => m.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import("@hello-pangea/dnd").then((m) => m.Draggable),
  { ssr: false }
);

export default function BlockEditorClient({
  initialPages = [
    { id: 1, title: "Project Overview" },
    { id: 2, title: "Meeting Notes" },
    { id: 3, title: "To-Do List" },
  ],
  initialBlocks = [
    { id: "b1", type: "text", content: "Start writing here..." },
  ],
  onChange,
}: BlockEditorProps) {
  const [pages] = useState<PageItemLite[]>(initialPages);
  const [selectedPage, setSelectedPage] = useState<PageItemLite>(
    initialPages[0]
  );
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  const addBlock = useCallback(
    (type: Block["type"] = "text") => {
      const newBlock: Block = { id: nanoid(), type, content: "" };
      setBlocks((prev) => {
        const next = [...prev, newBlock];
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  const updateBlock = useCallback(
    (id: string, content: string) => {
      setBlocks((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, content } : b));
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result?.destination) return;
      setBlocks((prev) => {
        const next = [...prev];
        const [removed] = next.splice(result.source.index, 1);
        next.splice(result.destination.index, 0, removed);
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-muted/40 p-5 border-r">
        <h2 className="text-base font-semibold mb-3">Pages</h2>
        <div className="space-y-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedPage.id === page.id ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              {page.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-5">
        <div className="mb-4 border-b pb-3">
          <h1 className="text-2xl font-semibold">{selectedPage.title}</h1>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {blocks.map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                  >
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="mb-3 rounded border bg-background p-2"
                      >
                        <textarea
                          value={block.content}
                          placeholder={`Type ${block.type} here...`}
                          onChange={(e) =>
                            updateBlock(block.id, e.target.value)
                          }
                          className="w-full resize-none outline-none bg-transparent p-2"
                          rows={3}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={() => addBlock("text")}
          className="mt-4 rounded bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
        >
          + Add Text Block
        </button>
      </div>
    </div>
  );
}
