"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Type,
  Save,
  Share2,
  Eye,
  Edit3,
  Search,
  CheckSquare,
  Minus,
  Table,
  AlignLeft,
} from "lucide-react";

export default function FallbackEditor() {
  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState(`TEXT`);

  const [isPreview, setIsPreview] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [slashQuery, setSlashQuery] = useState("");
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatContent = (text: string) => {
    return text
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">$1</h1>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">$1</h2>'
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">$1</h3>'
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">$1</code>'
      )
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4 bg-blue-50 py-2 rounded-r">$1</blockquote>'
      )
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>')
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-600 underline hover:text-blue-800">$1</a>'
      )
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br>");
  };

  const slashCommands = [
    {
      label: "Heading 1",
      description: "Create a top-level heading",
      keywords: ["h1", "heading 1", "heading"],
      icon: <span className="text-xl font-bold">H1</span>,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "\n# " + content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Heading 2",
      description: "Create a second-level heading",
      keywords: ["h2", "heading 2"],
      icon: <span className="text-xl font-bold">H2</span>,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "\n## " + content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Heading 3",
      description: "Create a third-level heading",
      keywords: ["h3", "heading 3"],
      icon: <span className="text-xl font-bold">H3</span>,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "\n### " + content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Bold",
      description: "Make text bold",
      keywords: ["bold", "strong"],
      icon: <Bold size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "**" +
          content.substring(cursor) +
          "**";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Italic",
      description: "Italicize text",
      keywords: ["italic", "emphasis"],
      icon: <Italic size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "*" + content.substring(cursor) + "*";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Underline",
      description: "Underline text",
      keywords: ["underline", "emphasis"],
      icon: <Underline size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "__" +
          content.substring(cursor) +
          "__";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Strikethrough",
      description: "Strikethrough text",
      keywords: ["strike", "strikethrough"],
      icon: <Minus size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "~~" +
          content.substring(cursor) +
          "~~";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Bullet List",
      description: "Create a bullet list",
      keywords: ["list", "ul", "bullet"],
      icon: <List size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "\n- " + content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Numbered List",
      description: "Create a numbered list",
      keywords: ["ol", "numbered list"],
      icon: <ListOrdered size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "\n1. " + content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Quote",
      description: "Insert a block quote",
      keywords: ["quote", "blockquote"],
      icon: <Quote size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "\n> " + content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Code",
      description: "Insert inline code",
      keywords: ["code", "inline code"],
      icon: <Code size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "`" + content.substring(cursor) + "`";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Table",
      description: "Insert a table",
      keywords: ["table", "insert table"],
      icon: <Table size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "\n| Column 1 | Column 2 |\n|----------|----------|\n|          |          |" +
          content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Checklist",
      description: "Insert a checklist",
      keywords: ["checklist", "todo"],
      icon: <CheckSquare size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) + "\n- [ ] " + content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Toggle List",
      description: "Insert a toggle list",
      keywords: ["toggle", "details"],
      icon: <Minus size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "\n<details><summary>Toggle</summary>\n\n</details>" +
          content.substring(cursor);
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Align Left",
      description: "Align text to the left",
      keywords: ["align left", "left"],
      icon: <AlignLeft size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "<div style='text-align: left'>" +
          content.substring(cursor) +
          "</div>";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Align Center",
      description: "Center align text",
      keywords: ["align center", "center"],
      icon: <AlignLeft size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "<div style='text-align: center'>" +
          content.substring(cursor) +
          "</div>";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
    {
      label: "Align Right",
      description: "Align text to the right",
      keywords: ["align right", "right"],
      icon: <AlignLeft size={16} />,
      action: () => {
        const cursor = textareaRef.current?.selectionStart ?? 0;
        const newContent =
          content.substring(0, cursor) +
          "<div style='text-align: right'>" +
          content.substring(cursor) +
          "</div>";
        setContent(newContent);
        setShowSlashMenu(false);
      },
    },
  ];

  const filteredSlashCommands = slashCommands.filter((cmd) => {
    if (!slashQuery) return true;
    const query = slashQuery.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.keywords.some((keyword) => keyword.includes(query))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setShowSlashMenu(false);
    }

    if (showSlashMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSlashIndex((prev) =>
          Math.min(prev + 1, filteredSlashCommands.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSlashIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const command = filteredSlashCommands[selectedSlashIndex];
        if (command) {
          executeSlashCommand(command);
        }
      }
    } else {
      const cursor = textareaRef.current?.selectionStart ?? 0;
      if (e.key === "Tab") {
        e.preventDefault();
        const newContent =
          content.substring(0, cursor) + "    " + content.substring(cursor);
        setContent(newContent);
      } else if (e.key === "Backspace") {
        const newContent =
          content.substring(0, cursor - 1) + content.substring(cursor);
        setContent(newContent);
      } else if (e.key === "Delete") {
        const newContent =
          content.substring(0, cursor) + content.substring(cursor + 1);
        setContent(newContent);
      }
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setContent(value);

    const cursor = e.target.selectionStart;
    const lineStart = value.lastIndexOf("\n", cursor - 1) + 1;
    const lineEnd = value.indexOf("\n", cursor);
    const currentLine = value.substring(
      lineStart,
      lineEnd === -1 ? undefined : lineEnd
    );

    if (currentLine.startsWith("/")) {
      setSlashQuery(currentLine.slice(1));
      setShowSlashMenu(true);
      const rect = e.target.getBoundingClientRect();
      setSlashMenuPosition({ x: rect.left, y: rect.bottom });
    } else {
      setShowSlashMenu(false);
    }
  };

  const executeSlashCommand = (command: (typeof slashCommands)[0]) => {
    const cursor = textareaRef.current?.selectionStart ?? 0;
    const newContent =
      content.substring(0, cursor) +
      command.label +
      " " +
      content.substring(cursor);
    setContent(newContent);
    setShowSlashMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowSlashMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [textareaRef]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
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
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                isPreview
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
              {isPreview ? "Edit" : "Preview"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <Save size={16} />
              Save
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Last edited today</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{content.split(/\s+/).length} words</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{content.length} characters</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {!isPreview && (
        <div className="px-8 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="Underline"
            >
              <Underline size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="Link"
            >
              <Link size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="List"
            >
              <List size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="Quote"
            >
              <Quote size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              title="Code"
            >
              <Code size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-8">
        {isPreview ? (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: `<p class="mb-4">${formatContent(content)}</p>`,
            }}
          />
        ) : (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[500px] border-none outline-none resize-none text-gray-900 text-base leading-relaxed font-mono"
              placeholder="Type '/' for commands, or start writing your content here..."
            />

            {/* Slash Command Menu - same as above */}
            {showSlashMenu && (
              <div
                className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-80"
                style={{
                  left: slashMenuPosition.x,
                  top: slashMenuPosition.y,
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 text-sm text-gray-500">
                  Slash Commands
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredSlashCommands.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No commands found
                    </div>
                  ) : (
                    filteredSlashCommands.map((command, index) => (
                      <div
                        key={command.label}
                        className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-all ${
                          selectedSlashIndex === index
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => executeSlashCommand(command)}
                        onMouseEnter={() => setSelectedSlashIndex(index)}
                      >
                        {command.icon}
                        <div className="flex-1">
                          <div className="font-medium">{command.label}</div>
                          <div className="text-gray-500">
                            {command.description}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 pb-6">
        <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <span>Markdown supported</span>
            <span>•</span>
            <span>Auto-saved</span>
          </div>
          <div>Last saved: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
}
