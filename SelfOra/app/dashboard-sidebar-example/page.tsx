"use client";

import { useState } from "react";
import { NotionSidebar } from "@/components/sidebar/notion-sidebar";
import { useRouter } from "next/navigation";

export default function DashboardWithSidebar() {
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const router = useRouter();

  const handlePageSelect = (pageId: string) => {
    console.log("Selected page:", pageId);
    setCurrentPageId(pageId);

    // Handle special pages
    if (pageId === "dashboard") {
      router.push("/dashboard");
    } else if (pageId === "goals") {
      router.push("/goals");
    } else if (pageId === "learning") {
      router.push("/learning");
    } else if (pageId === "settings") {
      router.push("/settings");
    } else {
      // Regular page navigation
      router.push(`/page/${pageId}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Notion Sidebar */}
      <NotionSidebar
        defaultOpen={true}
        onPageSelect={handlePageSelect}
        currentPageId={currentPageId ?? undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="container mx-auto p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Self-Ora
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your personal workspace for self-improvement and learning.
            </p>

            {/* Content Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Getting Started
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  👈 Use the sidebar to navigate between pages and workspaces.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Click on a page to view its content</li>
                  <li>Create new pages with the "+ New Page" button</li>
                  <li>Organize pages into folders and sub-pages</li>
                  <li>Star important pages for quick access</li>
                  <li>Search across all pages with the search bar</li>
                  <li>Switch between workspaces from the dropdown</li>
                </ul>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    💡 Keyboard Shortcut
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Press{" "}
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700 font-mono text-sm">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700 font-mono text-sm">
                      \
                    </kbd>{" "}
                    to toggle the sidebar
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <FeatureCard
                icon="📚"
                title="Learning Hub"
                description="Access curated learning videos and resources"
              />
              <FeatureCard
                icon="🎯"
                title="Goal Tracking"
                description="Set and track your personal development goals"
              />
              <FeatureCard
                icon="⭐"
                title="Daily Streaks"
                description="Build consistent habits and maintain streaks"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}
