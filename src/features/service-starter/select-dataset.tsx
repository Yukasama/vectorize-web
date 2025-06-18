import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useMemo, useState } from 'react';
import type { Dataset } from '../sidebar/services/dataset-service';
import { fetchDatasets } from '../sidebar/services/dataset-service';
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
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [localSelectedDatasets, setLocalSelectedDatasets] = useState<Dataset[]>(
    initialSelectedDatasets,
  );

  useEffect(() => {
    const loadDatasets = async () => {
      setLoading(true);
      try {
        const data = await fetchDatasets();
        setDatasets(data);
      } catch {
        setDatasets([]);
      } finally {
        setLoading(false);
      }
    };
    void loadDatasets();
  }, []);

  const filteredDatasets = useMemo(
    () =>
      datasets.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [datasets, search],
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
            datasets={filteredDatasets}
            loading={loading}
            onSelect={handleSelect}
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
