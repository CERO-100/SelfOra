"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Folder,
  FileText,
  Star,
  Clock,
  Settings,
  Menu,
  X,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
  Home,
  Target,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Types
interface Page {
  id: string;
  title: string;
  icon?: string;
  parent?: string | null;
  children?: Page[];
  is_favorite: boolean;
  workspace_id: string;
  order: number;
  created_at: string;
}

interface Workspace {
  id: string;
  name: string;
  icon?: string;
  owner: string;
}

interface NotionSidebarProps {
  defaultOpen?: boolean;
  onPageSelect?: (pageId: string) => void;
  currentPageId?: string;
}

export function NotionSidebar({
  defaultOpen = true,
  onPageSelect,
  currentPageId,
}: NotionSidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [recentPages, setRecentPages] = useState<Page[]>([]);
  const [favorites, setFavorites] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
    fetchRecentPages();
  }, []);

  // Fetch pages when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      fetchPages(currentWorkspace.id);
    }
  }, [currentWorkspace]);

  // Update favorites when pages change
  useEffect(() => {
    setFavorites(pages.filter((page) => page.is_favorite));
  }, [pages]);

  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/workspaces/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setWorkspaces(data.data);
        if (data.data.length > 0) {
          setCurrentWorkspace(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  };

  const fetchPages = async (workspaceId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/api/pages/?workspace=${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setPages(buildPageTree(data.data));
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    }
  };

  const fetchRecentPages = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/pages/recent/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRecentPages(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch recent pages:", error);
    }
  };

  // Build hierarchical page tree
  const buildPageTree = (flatPages: Page[]): Page[] => {
    const pageMap = new Map<string, Page>();
    const rootPages: Page[] = [];

    // Create map of all pages
    flatPages.forEach((page) => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    // Build tree structure
    flatPages.forEach((page) => {
      const pageNode = pageMap.get(page.id)!;
      if (page.parent) {
        const parent = pageMap.get(page.parent);
        if (parent) {
          parent.children!.push(pageNode);
        } else {
          rootPages.push(pageNode);
        }
      } else {
        rootPages.push(pageNode);
      }
    });

    // Sort by order
    const sortPages = (pages: Page[]) => {
      pages.sort((a, b) => a.order - b.order);
      pages.forEach((page) => {
        if (page.children && page.children.length > 0) {
          sortPages(page.children);
        }
      });
    };
    sortPages(rootPages);

    return rootPages;
  };

  const createNewPage = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/pages/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspace: currentWorkspace?.id,
          title: "Untitled",
          parent: null,
        }),
      });
      const data = await response.json();
      if (data.success && currentWorkspace) {
        fetchPages(currentWorkspace.id);
        if (onPageSelect) {
          onPageSelect(data.data.id);
        }
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  const togglePageExpansion = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const toggleFavorite = async (pageId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const page = pages.find((p) => p.id === pageId);
      await fetch(`http://localhost:8000/api/pages/${pageId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_favorite: !page?.is_favorite,
        }),
      });
      if (currentWorkspace) {
        fetchPages(currentWorkspace.id);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await fetch(`http://localhost:8000/api/pages/${pageId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (currentWorkspace) {
        fetchPages(currentWorkspace.id);
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const duplicatePage = async (pageId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/api/pages/${pageId}/duplicate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success && currentWorkspace) {
        fetchPages(currentWorkspace.id);
      }
    } catch (error) {
      console.error("Failed to duplicate page:", error);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Keyboard shortcut: Ctrl/Cmd + \
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
        variant="outline"
        size="icon"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-16",
          "md:translate-x-0"
        )}
      >
        {/* Workspace Switcher */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <DropdownMenu
            open={showWorkspaceDropdown}
            onOpenChange={setShowWorkspaceDropdown}
          >
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  !isOpen && "md:justify-center"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">
                    {currentWorkspace?.icon || "🧠"}
                  </span>
                  {isOpen && (
                    <span className="font-semibold text-sm truncate">
                      {currentWorkspace?.name || "Self-Ora"}
                    </span>
                  )}
                </div>
                {isOpen && <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                Workspaces
              </div>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => {
                    setCurrentWorkspace(workspace);
                    setShowWorkspaceDropdown(false);
                  }}
                  className={cn(
                    "flex items-center gap-2",
                    currentWorkspace?.id === workspace.id && "bg-gray-100"
                  )}
                >
                  <span>{workspace.icon || "📁"}</span>
                  <span>{workspace.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-blue-600">
                <Plus className="w-4 h-4" />
                <span>Create workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        {isOpen && (
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {/* Quick Links */}
          <SidebarSection title="Quick Access" isOpen={isOpen}>
            <SidebarItem
              icon={<Home className="w-4 h-4" />}
              label="Dashboard"
              isOpen={isOpen}
              onClick={() => onPageSelect?.("dashboard")}
            />
            <SidebarItem
              icon={<Target className="w-4 h-4" />}
              label="Goals"
              isOpen={isOpen}
              onClick={() => onPageSelect?.("goals")}
            />
            <SidebarItem
              icon={<BookOpen className="w-4 h-4" />}
              label="Learning"
              isOpen={isOpen}
              onClick={() => onPageSelect?.("learning")}
            />
          </SidebarSection>

          {/* Favorites */}
          {favorites.length > 0 && (
            <SidebarSection title="Favorites" isOpen={isOpen}>
              {favorites.map((page) => (
                <SidebarItem
                  key={page.id}
                  icon={
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  }
                  label={page.title}
                  isOpen={isOpen}
                  isActive={currentPageId === page.id}
                  onClick={() => onPageSelect?.(page.id)}
                  onAction={(action) => {
                    if (action === "delete") deletePage(page.id);
                    if (action === "favorite") toggleFavorite(page.id);
                    if (action === "duplicate") duplicatePage(page.id);
                  }}
                />
              ))}
            </SidebarSection>
          )}

          {/* Recent Pages */}
          {recentPages.length > 0 && (
            <SidebarSection title="Recent" isOpen={isOpen}>
              {recentPages.map((page) => (
                <SidebarItem
                  key={page.id}
                  icon={<Clock className="w-4 h-4" />}
                  label={page.title}
                  isOpen={isOpen}
                  isActive={currentPageId === page.id}
                  onClick={() => onPageSelect?.(page.id)}
                />
              ))}
            </SidebarSection>
          )}

          {/* Pages Tree */}
          <SidebarSection title="Pages" isOpen={isOpen}>
            <PageTreeView
              pages={pages}
              isOpen={isOpen}
              currentPageId={currentPageId}
              expandedPages={expandedPages}
              onToggleExpand={togglePageExpansion}
              onPageSelect={onPageSelect}
              onToggleFavorite={toggleFavorite}
              onDeletePage={deletePage}
              onDuplicatePage={duplicatePage}
            />
          </SidebarSection>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <Button
            onClick={createNewPage}
            className={cn(
              "w-full flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100",
              !isOpen && "md:justify-center md:px-0"
            )}
            variant="ghost"
          >
            <Plus className="w-4 h-4" />
            {isOpen && <span className="text-sm">New Page</span>}
          </Button>

          {isOpen && (
            <SidebarItem
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
              isOpen={isOpen}
              onClick={() => onPageSelect?.("settings")}
            />
          )}
        </div>

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3 rotate-90" />
          )}
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

// Sidebar Section Component
function SidebarSection({
  title,
  isOpen,
  children,
}: {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOpen) {
    return <div className="space-y-1">{children}</div>;
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>
      {isExpanded && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({
  icon,
  label,
  isOpen,
  isActive = false,
  onClick,
  onAction,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onAction?: (action: "delete" | "favorite" | "duplicate" | "edit") => void;
}) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
          isActive
            ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
          !isOpen && "md:justify-center"
        )}
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
          {icon}
        </span>
        {isOpen && <span className="flex-1 truncate text-left">{label}</span>}
      </button>

      {/* Action Menu */}
      {isOpen && onAction && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("edit");
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("favorite");
                }}
              >
                <Star className="w-4 h-4 mr-2" />
                Toggle Favorite
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("duplicate");
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("delete");
                }}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

// Recursive Page Tree View
function PageTreeView({
  pages,
  isOpen,
  currentPageId,
  expandedPages,
  onToggleExpand,
  onPageSelect,
  onToggleFavorite,
  onDeletePage,
  onDuplicatePage,
  level = 0,
}: {
  pages: Page[];
  isOpen: boolean;
  currentPageId?: string;
  expandedPages: Set<string>;
  onToggleExpand: (pageId: string) => void;
  onPageSelect?: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  level?: number;
}) {
  return (
    <>
      {pages.map((page) => (
        <div
          key={page.id}
          className={cn("transition-all", level > 0 && "pl-3")}
        >
          <div className="group relative">
            <button
              onClick={() => onPageSelect?.(page.id)}
              className={cn(
                "w-full flex items-center gap-1 px-2 py-1.5 rounded-md text-sm transition-all",
                currentPageId === page.id
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                level > 0 && "ml-2"
              )}
            >
              {/* Expand/Collapse Icon */}
              {page.children && page.children.length > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(page.id);
                  }}
                  className="flex items-center justify-center w-4 h-4 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {expandedPages.has(page.id) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              ) : (
                <span className="w-4" />
              )}

              {/* Page Icon */}
              <span className="text-gray-500 dark:text-gray-400">
                {page.icon || <FileText className="w-4 h-4" />}
              </span>

              {/* Page Title */}
              {isOpen && (
                <span className="flex-1 truncate text-left">{page.title}</span>
              )}
            </button>

            {/* Action Menu */}
            {isOpen && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(page.id);
                      }}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {page.is_favorite ? "Remove from" : "Add to"} Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicatePage(page.id);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePage(page.id);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Nested Children */}
          {page.children &&
            page.children.length > 0 &&
            expandedPages.has(page.id) && (
              <PageTreeView
                pages={page.children}
                isOpen={isOpen}
                currentPageId={currentPageId}
                expandedPages={expandedPages}
                onToggleExpand={onToggleExpand}
                onPageSelect={onPageSelect}
                onToggleFavorite={onToggleFavorite}
                onDeletePage={onDeletePage}
                onDuplicatePage={onDuplicatePage}
                level={level + 1}
              />
            )}
        </div>
      ))}
    </>
  );
}

export default NotionSidebar;
