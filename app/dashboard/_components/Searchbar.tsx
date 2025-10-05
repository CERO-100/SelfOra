import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileChartColumnIncreasingIcon, SearchIcon } from "lucide-react";
import React from "react";

const Searchbar = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild className="max-w-[80px]">
          <Button className="w-100 " variant="outline">
            <SearchIcon className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Input placeholder="Search You need..." />
            </DialogTitle>
                  </DialogHeader>
                  


          <div className="flex items-center gap-3">
            <FileChartColumnIncreasingIcon />
            Journal
                  </div>
                  

                  
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Searchbar;
