// components/notion-sidebar.tsx
"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Search,
  Bell,
  Users,
  FileText,
  Star,
  Plus,
  Settings,
  HelpCircle,
  Import,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPage } from "@/lib/api";

// Types for our workspace structure
interface Page {
  id: string;
  title: string;
  icon?: string;
  url: string;
  children?: Page[];
  isFavorite?: boolean;
}

interface Workspace {
  id: string;
  name: string;
  type: "personal" | "team" | "school";
  avatar?: string;
}

export function NotionSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedPages, setExpandedPages] = React.useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  // Mock data - replace with your actual data
  const currentWorkspace: Workspace = {
    id: "1",
    name: "Self-ora Workspace",
    type: "personal",
  };

  const pages: Page[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "🏠",
      url: "/dashboard",
    },
    {
      id: "learning",
      title: "Learning Paths",
      icon: "📚",
      url: "/learning",
      children: [
        {
          id: "javascript",
          title: "JavaScript Fundamentals",
          icon: "📝",
          url: "/learning/javascript",
        },
        {
          id: "react",
          title: "React Development",
          icon: "⚛️",
          url: "/learning/react",
        },
        {
          id: "nextjs",
          title: "Next.js Advanced",
          icon: "🚀",
          url: "/learning/nextjs",
        },
      ],
    },
    {
      id: "goals",
      title: "Goals & Progress",
      icon: "🎯",
      url: "/goals",
      children: [
        {
          id: "weekly",
          title: "Weekly Goals",
          icon: "📅",
          url: "/goals/weekly",
        },
        {
          id: "monthly",
          title: "Monthly Goals",
          icon: "📆",
          url: "/goals/monthly",
        },
      ],
    },
    {
      id: "notes",
      title: "Study Notes",
      icon: "📝",
      url: "/notes",
      children: [
        {
          id: "algorithms",
          title: "Algorithms",
          icon: "🧮",
          url: "/notes/algorithms",
        },
        {
          id: "system-design",
          title: "System Design",
          icon: "🏗️",
          url: "/notes/system-design",
        },
      ],
    },
    {
      id: "projects",
      title: "Projects",
      icon: "💼",
      url: "/projects",
      isFavorite: true,
    },
  ];

  const favoritePages = pages.filter((page) => page.isFavorite);

  const togglePageExpansion = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const renderPage = (page: Page, level = 0) => {
    const isActive = pathname === page.url;
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);

    return (
      <SidebarMenuItem key={page.id}>
        <SidebarMenuButton
          onClick={() => {
            if (hasChildren) {
              togglePageExpansion(page.id);
            } else {
              router.push(page.url);
            }
          }}
          isActive={isActive}
          className="group"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePageExpansion(page.id);
                }}
                className="flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <span className="flex-shrink-0">{page.icon}</span>
            <span className="truncate">{page.title}</span>
          </div>
        </SidebarMenuButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal className="h-4 w-4" />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              Add to Favorites
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasChildren && isExpanded && (
          <SidebarMenuSub>
            {page.children?.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <SidebarMenuSubButton asChild isActive={pathname === child.url}>
                  <a href={child.url}>
                    <span>{child.icon}</span>
                    <span>{child.title}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="inset">
      {/* Header - Workspace Section */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                    S
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentWorkspace.name}
                    </span>
                    <span className="truncate text-xs capitalize">
                      {currentWorkspace.type}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Workspace
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Workspace Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Access Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Search */}
              <SidebarMenuItem>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <SidebarInput
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </SidebarMenuItem>

              {/* Quick Access Items */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <a href="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/inbox">
                    <Bell className="h-4 w-4" />
                    <span>Updates</span>
                    <Badge variant="secondary" className="ml-auto">
                      3
                    </Badge>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/shared">
                    <Users className="h-4 w-4" />
                    <span>Shared with Me</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/all-pages">
                    <FileText className="h-4 w-4" />
                    <span>All Pages</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Favorites Section */}
        {favoritePages.length > 0 && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>
                <Star className="h-4 w-4" />
                Favorites
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favoritePages.map((page) => renderPage(page))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Main Pages Section */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            Workspace
            <SidebarMenuAction
              onClick={async (e) => {
                e.stopPropagation();
                const res = await createPage({ title: "Untitled" });
                if (res?.id) {
                  router.push(`/dashboard/editor/${res.id}`);
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </SidebarMenuAction>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{pages.map((page) => renderPage(page))}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Templates & Settings */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard/templates">
                <FileText className="h-4 w-4" />
                <span>Templates</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/import">
                <Import className="h-4 w-4" />
                <span>Import</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings & Members</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
