'use client';

import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

/**
 * ListViewToggle provides UI controls to switch between grid and table views.
 * Highlights the active view and calls setView on user interaction.
 * @param setView - Callback to set the current view
 * @param view - Current view ('grid' or 'table')
 */
interface ListViewToggleProps {
  setView: (view: 'grid' | 'table') => void;
  view: 'grid' | 'table';
}

export const ListViewToggle = ({ setView, view }: ListViewToggleProps) => {
  return (
    <div className="flex space-x-2">
      {/* Grid view button: highlights if grid is active */}
      <Button
        onClick={() => setView('grid')}
        variant={view === 'grid' ? 'default' : 'outline'}
      >
        <Grid className="h-4 w-4" />
      </Button>
      {/* Table view button: highlights if table is active */}
      <Button
        onClick={() => setView('table')}
        variant={view === 'table' ? 'default' : 'outline'}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
