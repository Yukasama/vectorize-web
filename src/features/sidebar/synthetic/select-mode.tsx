import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatasetList } from '@/features/service-starter/select-dataset/dataset-list';
import React from 'react';
import type { Dataset } from '../services/dataset-service';

interface SelectModeProps {
  handleSelect: (dataset: Dataset) => void;
  localSelectedDatasets: Dataset[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setView: React.Dispatch<React.SetStateAction<'grid' | 'table'>>;
  view: 'grid' | 'table';
}

export const SelectMode = ({
  handleSelect,
  localSelectedDatasets,
  search,
  setSearch,
  setView,
  view,
}: SelectModeProps) => (
  <div className="bg-muted/50 rounded-xl border">
    <div className="p-2">
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <Input
            className="w-full"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets..."
            value={search}
          />
          <div className="flex-shrink-0">
            <Button
              onClick={() => setView('grid')}
              size="sm"
              type="button"
              variant={view === 'grid' ? 'default' : 'outline'}
            >
              Grid
            </Button>
            <Button
              onClick={() => setView('table')}
              size="sm"
              type="button"
              variant={view === 'table' ? 'default' : 'outline'}
            >
              Table
            </Button>
          </div>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <div className="px-0 py-3">
          <DatasetList
            onSelect={handleSelect}
            search={search}
            selectedDatasets={localSelectedDatasets}
            view={view}
          />
        </div>
      </div>
    </div>
  </div>
);
