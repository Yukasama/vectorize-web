import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useMemo, useState } from 'react';
import type { Model } from '../sidebar/services/model-service';
import { fetchModels } from '../sidebar/services/model-service';
import { ModelList } from './select-model/model-list';
import { ModelListFooter } from './select-model/model-list-footer';
import { ModelListHeader } from './select-model/model-list-header';

export const SelectModel = ({
  initialSelectedModel,
  onBack,
  onNext,
  setSelectedModel,
}: {
  initialSelectedModel?: Model;
  onBack?: () => void;
  onNext?: () => void;
  setSelectedModel: (model: Model | undefined) => void;
}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [localSelectedModel, setLocalSelectedModel] = useState<
    Model | undefined
  >(initialSelectedModel);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        const data = await fetchModels();
        setModels(data);
      } catch {
        setModels([]);
      } finally {
        setLoading(false);
      }
    };
    void loadModels();
  }, []);

  const filteredModels = useMemo(
    () =>
      models.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())),
    [models, search],
  );

  const handleSelect = (model: Model) => {
    const newModel =
      localSelectedModel && localSelectedModel.id === model.id
        ? undefined
        : model;
    setLocalSelectedModel(newModel);
    setSelectedModel(newModel);
  };

  const handleClearSelected = () => {
    setLocalSelectedModel(undefined);
    setSelectedModel(undefined);
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col p-0">
      <ModelListHeader
        search={search}
        setSearch={setSearch}
        setView={setView}
        view={view}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="px-0 py-3">
          <ModelList
            loading={loading}
            models={filteredModels}
            onSelect={handleSelect}
            selectedModel={localSelectedModel}
            view={view}
          />
        </div>
      </ScrollArea>
      <ModelListFooter
        onBack={onBack}
        onClearSelected={handleClearSelected}
        onNext={onNext}
        selectedModel={localSelectedModel}
      />
    </div>
  );
};
