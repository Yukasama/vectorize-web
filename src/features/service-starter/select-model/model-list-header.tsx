'use client';

import { Input } from '@/components/ui/input';
import { ListViewToggle } from '../list-view-toggle';

interface ModelListHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  setView: (view: 'grid' | 'table') => void;
  view: 'grid' | 'table';
}

export const ModelListHeader = ({
  search,
  setSearch,
  setView,
  view,
}: ModelListHeaderProps) => (
  <div className="sticky top-0 left-0 z-10 flex flex-col gap-2 border-b px-4 py-3">
    <div className="flex items-center gap-2">
      {/* Search input for filtering models */}
      <Input
        className="w-full"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search models..."
        value={search}
      />
      {/* Toggle between grid and table view */}
      <ListViewToggle setView={setView} view={view} />
    </div>
  </div>
);
