'use client';

import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface ListViewToggleProps {
  setView: (view: 'grid' | 'table') => void;
  view: 'grid' | 'table';
}

/**
 * Toggle component to switch between grid and table view.
 */
export const ListViewToggle = ({ setView, view }: ListViewToggleProps) => {
  return (
    <div className="flex space-x-2">
      {/* Grid view button */}
      <Button
        onClick={() => setView('grid')}
        variant={view === 'grid' ? 'default' : 'outline'}
      >
        <Grid className="h-4 w-4" />
      </Button>
      {/* Table view button */}
      <Button
        onClick={() => setView('table')}
        variant={view === 'table' ? 'default' : 'outline'}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
