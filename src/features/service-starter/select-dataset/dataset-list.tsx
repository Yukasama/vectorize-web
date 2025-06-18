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
import type { Dataset } from '../../sidebar/services/dataset-service';

interface DatasetListProps {
  datasets: Dataset[];
  loading?: boolean;
  onSelect: (dataset: Dataset) => void;
  selectedDatasets: Dataset[];
  view: 'grid' | 'table';
}

export const DatasetList = ({
  datasets,
  loading = false,
  onSelect,
  selectedDatasets,
  view,
}: DatasetListProps) => {
  let content;
  if (loading) {
    content = (
      <div className="flex items-center justify-center py-8">Loading...</div>
    );
  } else if (view === 'grid') {
    content = (
      <div className="grid grid-cols-4 gap-4 px-4 py-3">
        {datasets.map((dataset) => {
          const isSelected = selectedDatasets.some((d) => d.id === dataset.id);
          return (
            <Card
              className={`cursor-pointer border-2 p-4 ${
                isSelected ? 'border-primary' : 'border-transparent'
              }`}
              key={dataset.id}
              onClick={() => onSelect(dataset)}
            >
              <p className="text-sm font-medium">
                {dataset.name.length > 17
                  ? dataset.name.slice(0, 17) + '...'
                  : dataset.name}
              </p>
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
      <Table className="py-3">
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
                    onChange={() => onSelect(dataset)}
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

  return <div className="relative">{content}</div>;
};
