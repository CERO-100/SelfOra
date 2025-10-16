// components/Block.tsx
import React from "react";

export function Block({ block, onDrag, onDrop, onComment }: {
  block: any;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onComment: (blockId: string) => void;
}) {
  return (
    <div draggable onDragStart={onDrag} onDrop={onDrop}>
      {/* Render block content based on type */}
      {block.type === "paragraph" && <p>{block.content.text}</p>}
      {block.type === "heading" && <h2>{block.content.text}</h2>}
      {/* ...other block types... */}

      {/* Comments */}
      <div>
        {block.comments?.map((c) => (
          <div key={c._id}>{c.text}</div>
        ))}
        <button onClick={() => onComment(block._id)}>Add Comment</button>
      </div>

      {/* Render children recursively */}
      {block.children?.map((child) => (
        <Block
          key={child._id}
          block={child}
          onDrag={onDrag}
          onDrop={onDrop}
          onComment={onComment}
        />
      ))}
    </div>
  );
}
