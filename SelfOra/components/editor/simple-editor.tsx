"use client";

import { useState } from "react";
import {
  EditorRoot,
  EditorContent,
  type JSONContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorCommandItem,
} from "novel";

import EditorMenu from "@/components/editor/editor-menu";
import { ColorSelector } from "@/components/editor/selectors/color-selector";
import { LinkSelector } from "@/components/editor/selectors/link-selector";
import { NodeSelector } from "@/components/editor/selectors/node-selector";
import { TextButtons } from "@/components/editor/selectors/text-buttons";
import { Separator } from "@/components/ui/separator";

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (content: string) => void;
}

const MathSelector = () => {
  return null; // Placeholder for math selector
};

export default function Editor({ initialValue, onChange }: EditorProp) {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  return (
    <div className="relative w-full max-w-screen-lg">
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={initialValue || defaultEditorContent}
          className="min-h-96 rounded-xl border p-4"
          editorProps={{
            attributes: {
              class:
                "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {/* Slash command items will appear here */}
            </EditorCommandList>
          </EditorCommand>

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />

            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />

            <Separator orientation="vertical" />
            <MathSelector />

            <Separator orientation="vertical" />
            <TextButtons />

            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
