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
import type { Dataset } from '../sidebar/services/dataset-service';
import { fetchDatasets } from '../sidebar/services/dataset-service';
import { ListViewToggle } from './list-view-toggle';

interface DatasetListProps {
  onBack?: () => void;
  onNext?: () => void;
  selectedDatasets: Dataset[];
  setSelectedDatasets: (datasets: Dataset[]) => void;
}

export const DatasetList = ({
  onBack,
  onNext,
  selectedDatasets,
  setSelectedDatasets,
}: DatasetListProps) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const loadDatasets = async () => {
      setLoading(true);
      try {
        const data = await fetchDatasets();
        setDatasets(data);
      } catch (error) {
        console.error('Error fetching datasets:', error);
        setDatasets([]);
      } finally {
        setLoading(false);
      }
    };
    void loadDatasets();
  }, []);

  const toggleDataset = (dataset: Dataset) => {
    if (selectedDatasets.some((d) => d.id === dataset.id)) {
      setSelectedDatasets(selectedDatasets.filter((d) => d.id !== dataset.id));
    } else {
      setSelectedDatasets([...selectedDatasets, dataset]);
    }
  };

  let content;
  if (loading) {
    content = <div>Loading...</div>;
  } else if (view === 'grid') {
    content = (
      <div className="grid grid-cols-2 gap-4">
        {datasets.map((dataset) => {
          const isSelected = selectedDatasets.some((d) => d.id === dataset.id);
          return (
            <Card
              className={`cursor-pointer border-2 p-4 ${isSelected ? 'border-primary' : 'border-transparent'}`}
              key={dataset.id}
              onClick={() => toggleDataset(dataset)}
            >
              <p className="text-sm font-medium">{dataset.name}</p>
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
          {datasets.map((dataset) => {
            const isSelected = selectedDatasets.some(
              (d) => d.id === dataset.id,
            );
            return (
              <TableRow key={dataset.id}>
                <TableCell>{dataset.name}</TableCell>
                <TableCell>
                  <input
                    aria-checked={isSelected}
                    checked={isSelected}
                    onChange={() => toggleDataset(dataset)}
                    type="checkbox"
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
          <h2 className="text-lg font-semibold">Datasets</h2>
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
            disabled={selectedDatasets.length === 0}
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
