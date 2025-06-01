'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu } from 'lucide-react';
import { DatasetList } from './dataset-list';
import { ModelList } from './model-list';

export const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <div
      className={`bg-accent h-screen text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } overflow-y-auto`}
    >
      {/* Sidebar toggle button */}
      <div className="flex items-center justify-end p-2">
        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-full">
        {/* Models section */}
        <ModelList isOpen={isOpen} />

        {/* Datasets section */}
        <DatasetList isOpen={isOpen} />
      </ScrollArea>
    </div>
  );
};
