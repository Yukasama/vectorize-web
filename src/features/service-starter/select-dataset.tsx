import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import type { Dataset } from '../sidebar/services/dataset-service';
import { DatasetList } from './select-dataset/dataset-list';
import { DatasetListFooter } from './select-dataset/select-dataset-footer';
import { DatasetListHeader } from './select-dataset/select-dataset-header';

/**
 * SelectDataset component allows users to search, select, and review datasets for a workflow step.
 * Handles local selection state, search, and view mode (grid/table), and passes selected datasets to parent on next.
 */
export const SelectDataset = ({
  initialSelectedDatasets = [],
  onBack,
  onNext,
  setSelectedDatasets,
}: {
  initialSelectedDatasets?: Dataset[];
  onBack?: () => void;
  onNext?: () => void;
  setSelectedDatasets: (datasets: Dataset[]) => void;
}) => {
  // Search string for filtering datasets
  const [search, setSearch] = useState('');
  // View mode: grid or table
  const [view, setView] = useState<'grid' | 'table'>('grid');
  // Local state for selected datasets
  const [localSelectedDatasets, setLocalSelectedDatasets] = useState<Dataset[]>(
    initialSelectedDatasets,
  );

  // Toggle selection of a dataset
  const handleSelect = (dataset: Dataset) => {
    if (localSelectedDatasets.some((d) => d.id === dataset.id)) {
      setLocalSelectedDatasets(
        localSelectedDatasets.filter((d) => d.id !== dataset.id),
      );
    } else {
      setLocalSelectedDatasets([...localSelectedDatasets, dataset]);
    }
  };

  // Pass selected datasets to parent and trigger next step
  const handleNext = () => {
    setSelectedDatasets(localSelectedDatasets);
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col p-0">
      <DatasetListHeader
        search={search}
        setSearch={setSearch}
        setView={setView}
        view={view}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="px-0 py-3">
          <DatasetList
            onSelect={handleSelect}
            search={search}
            selectedDatasets={localSelectedDatasets}
            view={view}
          />
        </div>
      </ScrollArea>
      <DatasetListFooter
        onBack={onBack}
        onNext={handleNext}
        selectedDatasets={localSelectedDatasets}
      />
    </div>
  );
};
