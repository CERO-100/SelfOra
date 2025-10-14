
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ThemeToggle } from "../../../../components/ui/ThemeToggle";
import Searchbar from "@/app/(protected)/dashboard/_components/Searchbar";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="  px-4 py-4">
        <div className="flex items-center justify-between">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Searchbar />
            <ThemeToggle />
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
