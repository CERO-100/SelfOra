"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FileTextIcon, FileChartColumnIncreasingIcon } from "lucide-react";

const Searchbar = () => {
  return (
    <div className="flex items-center">
      {/* Toolbar Search Trigger */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 w-[280px] text-muted-foreground hover:text-foreground"
          >
            <SearchIcon className="w-4 h-4" />
            <span className="text-sm">Search...</span>
            <kbd className="ml-auto text-xs border rounded px-1 py-0.5 bg-muted">
              Ctrl K
            </kbd>
          </Button>
        </DialogTrigger>

        {/* Search Dialog */}
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Search</DialogTitle>
          </DialogHeader>

          {/* Inner Search Input */}
          <div className="mt-3">
            <div className="flex items-center border rounded-md px-3 py-2">
              <SearchIcon className="w-4 h-4 text-muted-foreground mr-2" />
              <Input
                placeholder="Type to search..."
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Example Search Results */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md cursor-pointer">
              <FileTextIcon className="w-4 h-4 text-muted-foreground" />
              <span>My Notes</span>
            </div>
            <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md cursor-pointer">
              <FileChartColumnIncreasingIcon className="w-4 h-4 text-muted-foreground" />
              <span>Journal Entries</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Searchbar;
