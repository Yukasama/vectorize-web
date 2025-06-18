import { Input } from '@/components/ui/input';
import { ListViewToggle } from '../list-view-toggle';

interface DatasetListHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  setView: (view: 'grid' | 'table') => void;
  view: 'grid' | 'table';
}

export const DatasetListHeader = ({
  search,
  setSearch,
  setView,
  view,
}: DatasetListHeaderProps) => (
  <div className="sticky top-0 left-0 z-10 flex flex-col gap-2 border-b px-4 py-3">
    <div className="flex items-center gap-2">
      <Input
        className="w-full"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search datasets..."
        value={search}
      />
      <ListViewToggle setView={setView} view={view} />
    </div>
  </div>
);
