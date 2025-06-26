import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import type { Model } from '../sidebar/services/model-service';
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
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [localSelectedModel, setLocalSelectedModel] = useState<
    Model | undefined
  >(initialSelectedModel);

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
            onSelect={handleSelect}
            search={search}
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
