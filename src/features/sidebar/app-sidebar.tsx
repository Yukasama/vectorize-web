'use client';

import { Sidebar, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { DatasetList } from './dataset/dataset-list';
import { ModelList } from './model/model-list';

export const AppSidebar = () => {
  const { open } = useSidebar(); // <-- get sidebar state

  return (
    <div className="relative flex h-full">
      {/* Sidebar */}
      <Sidebar className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-all duration-300">
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
          {/* Sidebar header */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Vectorize</span>
          </div>
          {/* Sidebar navigation/content */}
          <nav className="flex flex-1 flex-col gap-2">
            <ModelList isOpen={open} />
            <DatasetList isOpen={open} />
          </nav>
          {/* Sidebar footer */}
          <div className="mt-auto flex items-center gap-2">
            {/* Optional: Footer content */}
          </div>
        </div>
        <SidebarRail />
      </Sidebar>
    </div>
  );
};
