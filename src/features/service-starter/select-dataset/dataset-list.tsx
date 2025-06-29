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
import { useQuery } from '@tanstack/react-query';
import type { Dataset } from '../../sidebar/services/dataset-service';
import { fetchDatasets } from '../../sidebar/services/dataset-service';

interface DatasetListProps {
  onSelect: (dataset: Dataset) => void;
  search: string;
  selectedDatasets: Dataset[];
  view: 'grid' | 'table';
}

export const DatasetList = ({
  onSelect,
  search,
  selectedDatasets,
  view,
}: DatasetListProps) => {
  const {
    data: datasets = [],
    error,
    isLoading,
  } = useQuery({
    queryFn: fetchDatasets,
    queryKey: ['datasets'],
  });

  const filteredDatasets = datasets.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center py-8">Loading...</div>
    );
  } else if (error) {
    content = <div className="text-red-500">Error loading datasets.</div>;
  } else if (view === 'grid') {
    content = (
      <div className="grid grid-cols-4 gap-4 px-4 py-3">
        {filteredDatasets.map((dataset) => {
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
          {filteredDatasets.map((dataset) => {
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
