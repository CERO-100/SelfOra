"use client";

import dynamic from "next/dynamic";
import type { BlockEditorProps } from "./BlockEditor.types.ts";

const BlockEditorClient = dynamic<BlockEditorProps>(
  () => import("./BlockEditor.client"),
  { ssr: false }
);

export default function BlockEditor(props: BlockEditorProps) {
  return <BlockEditorClient {...props} />;
}
