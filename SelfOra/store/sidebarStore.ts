import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface SidebarState {
  // State
  isOpen: boolean;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  pages: Page[];
  recentPages: Page[];
  currentPageId: string | null;
  expandedPages: Set<string>;

  // Actions
  setIsOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setCurrentWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setPages: (pages: Page[]) => void;
  setRecentPages: (pages: Page[]) => void;
  setCurrentPageId: (pageId: string | null) => void;
  togglePageExpansion: (pageId: string) => void;
  addRecentPage: (page: Page) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen: true,
      currentWorkspace: null,
      workspaces: [],
      pages: [],
      recentPages: [],
      currentPageId: null,
      expandedPages: new Set(),

      // Actions
      setIsOpen: (isOpen) => set({ isOpen }),
      
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      
      setWorkspaces: (workspaces) => set({ workspaces }),
      
      setPages: (pages) => set({ pages }),
      
      setRecentPages: (pages) => set({ recentPages: pages.slice(0, 5) }),
      
      setCurrentPageId: (pageId) => {
        set({ currentPageId: pageId });
        // Add to recent pages
        if (pageId) {
          const state = get();
          const page = findPageById(state.pages, pageId);
          if (page) {
            get().addRecentPage(page);
          }
        }
      },
      
      togglePageExpansion: (pageId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedPages);
          if (newExpanded.has(pageId)) {
            newExpanded.delete(pageId);
          } else {
            newExpanded.add(pageId);
          }
          return { expandedPages: newExpanded };
        }),
      
      addRecentPage: (page) =>
        set((state) => {
          const recent = state.recentPages.filter((p) => p.id !== page.id);
          return { recentPages: [page, ...recent].slice(0, 5) };
        }),
    }),
    {
      name: 'selfora-sidebar-storage',
      partialize: (state) => ({
        isOpen: state.isOpen,
        currentWorkspace: state.currentWorkspace,
        expandedPages: Array.from(state.expandedPages), // Convert Set to Array for storage
        recentPages: state.recentPages,
      }),
    }
  )
);

// Helper function to find page by ID in tree
function findPageById(pages: Page[], pageId: string): Page | null {
  for (const page of pages) {
    if (page.id === pageId) return page;
    if (page.children) {
      const found = findPageById(page.children, pageId);
      if (found) return found;
    }
  }
  return null;
}
