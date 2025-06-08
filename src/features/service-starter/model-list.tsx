'use client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import type { Model } from '../sidebar/services/model-service';
import { fetchModels } from '../sidebar/services/model-service';
import { ListViewToggle } from './list-view-toggle';

interface ModelListProps {
  onBack?: () => void;
  onNext?: () => void;
  selectedModel?: Model;
  setSelectedModel: (model?: Model) => void;
}

export const ModelList = ({
  onBack,
  onNext,
  selectedModel,
  setSelectedModel,
}: ModelListProps) => {
  const [models, setModels] = useState<Model[]>([]);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        const data = await fetchModels();
        setModels(data);
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
      } finally {
        setLoading(false);
      }
    };
    void loadModels();
  }, []);

  const handleSelect = (model: Model) => {
    setSelectedModel(
      selectedModel && selectedModel.id === model.id ? undefined : model,
    );
  };

  let content;
  if (loading) {
    content = <div>Loading...</div>;
  } else if (view === 'grid') {
    content = (
      <div className="grid grid-cols-4 gap-4">
        {models.map((model) => {
          const isSelected = selectedModel?.id === model.id;
          return (
            <Card
              className={`cursor-pointer border-2 p-4 ${isSelected ? 'border-primary' : 'border-transparent'}`}
              key={model.id}
              onClick={() => handleSelect(model)}
            >
              <p className="text-sm font-medium">{model.name}</p>
              {isSelected && (
                <span className="text-primary text-xs">Selected</span>
              )}
            </Card>
          );
        })}
      </div>
    );
  } else {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Select</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => {
            const isSelected = selectedModel?.id === model.id;
            return (
              <TableRow key={model.id}>
                <TableCell>{model.name}</TableCell>
                <TableCell>
                  <input
                    aria-checked={isSelected}
                    checked={isSelected}
                    name="model-select"
                    onChange={() => handleSelect(model)}
                    type="radio"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Modelle</h2>
        </div>
        <ListViewToggle setView={setView} view={view} />
      </div>
      {content}
      <div className="mt-6 flex gap-2">
        {onBack && (
          <button className="btn" onClick={onBack} type="button">
            Back
          </button>
        )}
        {onNext && (
          <button
            className="btn btn-primary"
            disabled={!selectedModel}
            onClick={onNext}
            type="button"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
