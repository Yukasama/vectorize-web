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
import { fetchAllDatasets } from '../../sidebar/services/dataset-service';

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
  // Fetch all datasets using React Query
  const {
    data: datasets = [],
    error,
    isLoading,
  } = useQuery({
    queryFn: fetchAllDatasets,
    queryKey: ['datasets'],
  });

  // Filter datasets by search string
  const filteredDatasets = datasets.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  let content;
  if (isLoading) {
    // Show loading state while fetching datasets
    content = (
      <div className="flex items-center justify-center py-8">Loading...</div>
    );
  } else if (error) {
    // Show error state if datasets could not be loaded
    content = <div className="text-red-500">Error loading datasets.</div>;
  } else if (view === 'grid') {
    // Render datasets as a grid of cards
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
              <p className="truncate text-sm font-medium" title={dataset.name}>
                {dataset.name}
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
    // Render datasets as a table with checkboxes
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
                <TableCell className="max-w-0 truncate" title={dataset.name}>
                  {dataset.name}
                </TableCell>
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
