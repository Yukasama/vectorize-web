import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import type { Dataset } from '../sidebar/services/dataset-service';
import { DatasetList } from './select-dataset/dataset-list';
import { DatasetListFooter } from './select-dataset/select-dataset-footer';
import { DatasetListHeader } from './select-dataset/select-dataset-header';

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
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [localSelectedDatasets, setLocalSelectedDatasets] = useState<Dataset[]>(
    initialSelectedDatasets,
  );

  const handleSelect = (dataset: Dataset) => {
    if (localSelectedDatasets.some((d) => d.id === dataset.id)) {
      setLocalSelectedDatasets(
        localSelectedDatasets.filter((d) => d.id !== dataset.id),
      );
    } else {
      setLocalSelectedDatasets([...localSelectedDatasets, dataset]);
    }
  };

  const handleClearSelected = (id: string) => {
    setLocalSelectedDatasets(localSelectedDatasets.filter((d) => d.id !== id));
  };

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
        onClearSelected={handleClearSelected}
        onNext={handleNext}
        selectedDatasets={localSelectedDatasets}
      />
    </div>
  );
};
