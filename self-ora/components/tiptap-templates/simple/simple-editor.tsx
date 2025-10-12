"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  MoreHorizontal,
  Plus,
  Type,
  Save,
  Share2,
  Image,
  Table,
  Calendar,
  FileText,
  CheckSquare,
  Hash,
  Minus,
  AlignLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/tiptap-ui-primitive/button/button";

// Use a simple fallback editor instead of BlockNote
export default function Editor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <NotionEditorSkeleton />;
  }

  return <ClientEditor />;
}

function NotionEditorSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ClientEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titlePlaceholder] = useState("Untitled Document");
  const [contentPlaceholder] = useState(`# Welcome to Self-Ora!

Start writing your amazing content here...

## What you can do:

- Use **bold** and *italic* text
- Create headers with #, ##, ###
- Add bullet points with -
- Quote text with >
- Add \`code\` snippets
- Type / for more commands

Happy writing! 🚀`);

  const [isEditing, setIsEditing] = useState(true);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [slashQuery, setSlashQuery] = useState("");
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);
  const [isInList, setIsInList] = useState(false);
  const [listType, setListType] = useState<"bullet" | "numbered" | null>(null);
  const [numberedListCounter, setNumberedListCounter] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toolbarItems = [
    {
      id: "heading1",
      icon: Heading1,
      label: "Heading 1",
      action: () => insertText("# "),
    },
    {
      id: "heading2",
      icon: Heading2,
      label: "Heading 2",
      action: () => insertText("## "),
    },
    {
      id: "heading3",
      icon: Heading3,
      label: "Heading 3",
      action: () => insertText("### "),
    },
    {
      id: "bold",
      icon: Bold,
      label: "Bold",
      action: () => insertText("**bold**"),
    },
    {
      id: "italic",
      icon: Italic,
      label: "Italic",
      action: () => insertText("*italic*"),
    },
    {
      id: "link",
      icon: Link,
      label: "Link",
      action: () => insertText("[link text](url)"),
    },
    {
      id: "bullet",
      icon: List,
      label: "Bullet List",
      action: () => insertListItem("bullet"),
    },
    {
      id: "numbered",
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertListItem("numbered"),
    },
    {
      id: "quote",
      icon: Quote,
      label: "Quote",
      action: () => insertText("> "),
    },
    {
      id: "code",
      icon: Code,
      label: "Code",
      action: () => insertText("`code`"),
    },
  ];

  // Slash command options
  const slashCommands = [
    {
      id: "heading1",
      label: "Heading 1",
      description: "Big section heading",
      icon: Heading1,
      command: "# ",
      keywords: ["h1", "heading", "title", "big"],
    },
    {
      id: "heading2",
      label: "Heading 2",
      description: "Medium section heading",
      icon: Heading2,
      command: "## ",
      keywords: ["h2", "heading", "subtitle"],
    },
    {
      id: "heading3",
      label: "Heading 3",
      description: "Small section heading",
      icon: Heading3,
      command: "### ",
      keywords: ["h3", "heading", "subheading"],
    },
    {
      id: "paragraph",
      label: "Text",
      description: "Just start writing with plain text",
      icon: AlignLeft,
      command: "",
      keywords: ["text", "paragraph", "p"],
    },
    {
      id: "bulletlist",
      label: "Bulleted list",
      description: "Create a simple bulleted list",
      icon: List,
      command: "- ",
      keywords: ["list", "bullet", "ul"],
    },
    {
      id: "numberedlist",
      label: "Numbered list",
      description: "Create a list with numbering",
      icon: ListOrdered,
      command: "1. ",
      keywords: ["list", "numbered", "ol", "number"],
    },
    {
      id: "todo",
      label: "To-do list",
      description: "Track tasks with a to-do list",
      icon: CheckSquare,
      command: "- [ ] ",
      keywords: ["todo", "task", "check", "checkbox"],
    },
    {
      id: "quote",
      label: "Quote",
      description: "Capture a quote",
      icon: Quote,
      command: "> ",
      keywords: ["quote", "blockquote", "citation"],
    },
    {
      id: "code",
      label: "Code",
      description: "Capture a code snippet",
      icon: Code,
      command: "```\n",
      keywords: ["code", "snippet", "programming"],
    },
    {
      id: "divider",
      label: "Divider",
      description: "Visually divide blocks",
      icon: Minus,
      command: "\n---\n",
      keywords: ["divider", "separator", "hr", "line"],
    },
    {
      id: "table",
      label: "Table",
      description: "Add a table",
      icon: Table,
      command:
        "\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n",
      keywords: ["table", "grid", "data"],
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

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        content.substring(0, start) + text + content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  const insertListItem = (type: "bullet" | "numbered") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // Check if we're at the beginning of a line or after whitespace
    const isAtLineStart = currentLine.trim() === "";

    if (type === "bullet") {
      setListType("bullet");
      setIsInList(true);
      if (isAtLineStart) {
        insertText("- ");
      } else {
        insertText("\n- ");
      }
    } else if (type === "numbered") {
      setListType("numbered");
      setIsInList(true);
      setNumberedListCounter(1);
      if (isAtLineStart) {
        insertText("1. ");
      } else {
        insertText("\n1. ");
      }
    }
  };

  const handleSave = () => {
    setSavedAt(new Date());
    // Here you would typically save to your backend
    console.log("Saving document...", { title, content });
  };

  const formatContent = (text: string) => {
    return text
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-8">$1</h1>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">$1</h2>'
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">$1</blockquote>'
      )
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, "<br>");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (showSlashMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSlashIndex((prev) =>
          prev < filteredSlashCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSlashIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSlashCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeSlashCommand(filteredSlashCommands[selectedSlashIndex]);
      } else if (e.key === "Escape") {
        setShowSlashMenu(false);
        setSlashQuery("");
      }
      return;
    }

    // Handle Enter key for list continuation
    if (e.key === "Enter" && isInList) {
      e.preventDefault();

      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPosition);
      const textAfterCursor = content.substring(cursorPosition);
      const lines = textBeforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

      // Check if current line is an empty list item
      const isBulletLine = currentLine.match(/^(\s*)- $/);
      const isNumberedLine = currentLine.match(/^(\s*)\d+\. $/);

      if (isBulletLine || isNumberedLine) {
        // Empty list item - exit list mode
        const lineStart = textBeforeCursor.lastIndexOf("\n") + 1;
        const newContent =
          textBeforeCursor.substring(0, lineStart) + textAfterCursor;
        setContent(newContent);
        setIsInList(false);
        setListType(null);
        setNumberedListCounter(1);

        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
      } else {
        // Continue the list
        let newListItem = "";
        if (listType === "bullet") {
          const indent = currentLine.match(/^(\s*)/)?.[1] || "";
          newListItem = `\n${indent}- `;
        } else if (listType === "numbered") {
          const indent = currentLine.match(/^(\s*)/)?.[1] || "";
          const nextNumber = numberedListCounter + 1;
          setNumberedListCounter(nextNumber);
          newListItem = `\n${indent}${nextNumber}. `;
        }

        const newContent = textBeforeCursor + newListItem + textAfterCursor;
        setContent(newContent);

        setTimeout(() => {
          const newPosition = cursorPosition + newListItem.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }

    // Handle Backspace for list removal
    else if (e.key === "Backspace" && isInList) {
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPosition);
      const lines = textBeforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

      // Check if cursor is right after list marker
      const bulletMatch = currentLine.match(/^(\s*)- $/);
      const numberedMatch = currentLine.match(/^(\s*)\d+\. $/);

      if (bulletMatch || numberedMatch) {
        e.preventDefault();

        // Remove the list marker
        const lineStart = textBeforeCursor.lastIndexOf("\n") + 1;
        const lineEnd = cursorPosition;
        const beforeLine = content.substring(0, lineStart);
        const afterLine = content.substring(lineEnd);
        const indent = bulletMatch?.[1] || numberedMatch?.[1] || "";

        const newContent = beforeLine + indent + afterLine;
        setContent(newContent);

        // Exit list mode if this was the only item or move to previous item
        const remainingLines = beforeLine.split("\n");
        const prevLine = remainingLines[remainingLines.length - 2] || "";
        const hasPrevListItem = prevLine.match(/^(\s*)(-|\d+\.)\s/);

        if (!hasPrevListItem) {
          setIsInList(false);
          setListType(null);
          setNumberedListCounter(1);
        }

        setTimeout(() => {
          const newPosition = lineStart + indent.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;

    setContent(newContent);

    // Check current line for list detection
    const textBeforeCursor = newContent.substring(0, cursorPosition);
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // Detect if we're in a list
    const bulletMatch = currentLine.match(/^(\s*)- /);
    const numberedMatch = currentLine.match(/^(\s*)(\d+)\. /);

    if (bulletMatch && listType !== "bullet") {
      setIsInList(true);
      setListType("bullet");
    } else if (numberedMatch && listType !== "numbered") {
      setIsInList(true);
      setListType("numbered");
      setNumberedListCounter(parseInt(numberedMatch[2]));
    } else if (!bulletMatch && !numberedMatch && isInList) {
      // Check if any line in the current context has list markers
      const hasListMarkers = lines.some(
        (line) => line.match(/^(\s*)(-|\d+\.)\s/) && line.trim() !== ""
      );
      if (!hasListMarkers) {
        setIsInList(false);
        setListType(null);
        setNumberedListCounter(1);
      }
    }

    // Check for slash command trigger
    const slashMatch = currentLine.match(/\/(\w*)$/);

    if (slashMatch) {
      const query = slashMatch[1];
      setSlashQuery(query);
      setSelectedSlashIndex(0);

      // Calculate position for slash menu
      const textarea = e.target;
      const lineHeight = 24;
      const currentLineIndex = lines.length - 1;
      const rect = textarea.getBoundingClientRect();

      setSlashMenuPosition({
        x: rect.left + 32,
        y: rect.top + (currentLineIndex + 1) * lineHeight + 40,
      });

      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
  };

  const executeSlashCommand = (command: (typeof slashCommands)[0]) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);

    // Find and replace the slash command
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];
    const slashIndex = currentLine.lastIndexOf("/");

    if (slashIndex !== -1) {
      const beforeSlash =
        lines.slice(0, -1).join("\n") +
        (lines.length > 1 ? "\n" : "") +
        currentLine.substring(0, slashIndex);

      // Special handling for list commands
      if (command.id === "bulletlist") {
        setIsInList(true);
        setListType("bullet");
      } else if (command.id === "numberedlist") {
        setIsInList(true);
        setListType("numbered");
        setNumberedListCounter(1);
      }

      const newContent = beforeSlash + command.command + textAfterCursor;

      setContent(newContent);
      setShowSlashMenu(false);
      setSlashQuery("");

      // Set cursor position after the inserted command
      setTimeout(() => {
        const newPosition = beforeSlash.length + command.command.length;
        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  // Close slash menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSlashMenu(false);
      setSlashQuery("");
    };

    if (showSlashMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showSlashMenu]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Notion-style Header */}
      <div className="px-8 py-6 border-b border-gray-50 bg-white">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
              <Type size={14} className="text-white" />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
                style={{ minHeight: "2.5rem" }}
              />
              {!title && (
                <div className="absolute inset-0 text-2xl font-bold text-gray-400 pointer-events-none flex items-center">
                  {titlePlaceholder}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Last edited by you</span>
            <span>•</span>
            <span>
              {savedAt
                ? savedAt.toLocaleString()
                : new Date().toLocaleDateString()}
            </span>
            {savedAt && <span className="text-green-600">• Saved</span>}
          </div>
        </div>

        {/* Floating Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            {toolbarItems.slice(0, 6).map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={tool.action}
                  className="p-2 rounded-md transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  title={tool.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}

            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            {toolbarItems.slice(6).map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={tool.action}
                  className="p-2 rounded-md transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  title={tool.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={16} />
              More
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {/* Add Block Button */}
        <div className="absolute left-2 top-4 opacity-0 hover:opacity-100 transition-opacity z-10">
          <Button
            onClick={() => insertText("\n\n")}
            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pt-4">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isEditing
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                !isEditing
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Editor/Preview Content */}
        <div className="px-8 py-6">
          {isEditing ? (
            <div className="relative">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="editor-content"
                  value={content}
                  onChange={handleContentChange}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[500px] border-none outline-none resize-none text-gray-900 text-base leading-relaxed font-mono bg-transparent"
                />
                {!content && (
                  <div className="absolute inset-0 text-gray-400 text-base leading-relaxed font-mono pointer-events-none whitespace-pre-wrap">
                    {contentPlaceholder}
                  </div>
                )}
              </div>

              {/* List Helper Indicator */}
              {isInList && (
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  {listType === "bullet"
                    ? "• Bullet list active"
                    : "1. Numbered list active"}
                  <span className="ml-2 text-blue-500">
                    Press Enter to continue, Backspace to remove
                  </span>
                </div>
              )}

              {/* Slash Command Menu */}
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
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search size={14} />
                      <span>Basic blocks</span>
                      {slashQuery && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          "{slashQuery}"
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {filteredSlashCommands.map((command, index) => {
                      const Icon = command.icon;
                      return (
                        <button
                          key={command.id}
                          onClick={() => executeSlashCommand(command)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                            index === selectedSlashIndex
                              ? "bg-blue-50 border-r-2 border-blue-500"
                              : ""
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded ${
                              index === selectedSlashIndex
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              size={16}
                              className={
                                index === selectedSlashIndex
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {command.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {command.description}
                            </div>
                          </div>
                          {index === selectedSlashIndex && (
                            <div className="text-xs text-gray-400">↵</div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {filteredSlashCommands.length === 0 && (
                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                      No commands found for "{slashQuery}"
                    </div>
                  )}

                  <div className="px-3 py-2 border-t border-gray-100">
                    <div className="text-xs text-gray-400 flex items-center gap-4">
                      <span>↑↓ to navigate</span>
                      <span>↵ to select</span>
                      <span>esc to dismiss</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="min-h-[500px] prose prose-gray max-w-none">
              {content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                />
              ) : (
                <div className="text-gray-400 whitespace-pre-wrap">
                  {formatContent(contentPlaceholder)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>Type</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">
                /
              </kbd>
              <span>for commands, or use markdown syntax</span>
              {isInList && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">
                    {listType === "bullet" ? "Bullet" : "Numbered"} list mode
                    active
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>
                {content.length || contentPlaceholder.length} characters
              </span>
              <span>•</span>
              <span>
                {(content || contentPlaceholder).split(/\s+/).length} words
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
