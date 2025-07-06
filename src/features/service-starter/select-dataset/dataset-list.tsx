'use client';

import { Card } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Calendar, CheckCircle2, Database, FileText } from 'lucide-react';
import type { Dataset } from '../../sidebar/services/dataset-service';
import { fetchAllDatasets } from '../../sidebar/services/dataset-service';

interface DatasetListProps {
  onSelect: (dataset: Dataset) => void;
  search: string;
  selectedDatasets: Dataset[];
  view: 'grid' | 'table';
}

// Helper function to format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Helper function to format file size
const formatFileSize = (sizeInBytes?: number) => {
  if (!sizeInBytes) return 'Unknown size';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

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
    // Render datasets as a grid of cards with hover effects
    content = (
      <div className="grid grid-cols-4 gap-4 px-4 py-3">
        {filteredDatasets.map((dataset) => {
          const isSelected = selectedDatasets.some((d) => d.id === dataset.id);
          return (
            <HoverCard key={dataset.id} openDelay={300}>
              <HoverCardTrigger asChild>
                <Card
                  className={cn(
                    'relative cursor-pointer p-4 transition-all duration-200 hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-primary/20 scale-105 ring-2'
                      : 'border-border hover:border-primary/50 hover:bg-accent/20',
                  )}
                  onClick={() => onSelect(dataset)}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="animate-in zoom-in-75 absolute -top-2 -right-2 duration-200">
                      <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full shadow-lg">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p
                      className="text-sm leading-tight font-medium"
                      title={dataset.name}
                    >
                      {truncateText(dataset.name, 25)}
                    </p>

                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Database className="h-3 w-3" />
                      <span>Dataset</span>
                    </div>

                    {isSelected && (
                      <div className="animate-in slide-in-from-bottom-2 duration-200">
                        <span className="text-primary text-xs font-medium">
                          ✓ Selected
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </HoverCardTrigger>

              <HoverCardContent className="w-80" side="top">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold">{dataset.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {dataset.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-3 w-3" />
                        <div>
                          <div className="text-muted-foreground">Created</div>
                          <div className="font-medium">
                            {formatDate(dataset.created_at)}
                          </div>
                        </div>
                      </div>
                    )}

                    {dataset.size && (
                      <div className="flex items-center gap-2">
                        <FileText className="text-muted-foreground h-3 w-3" />
                        <div>
                          <div className="text-muted-foreground">Size</div>
                          <div className="font-medium">
                            {formatFileSize(dataset.size)}
                          </div>
                        </div>
                      </div>
                    )}

                    {dataset.records_count && (
                      <div className="flex items-center gap-2">
                        <Database className="text-muted-foreground h-3 w-3" />
                        <div>
                          <div className="text-muted-foreground">Records</div>
                          <div className="font-medium">
                            {dataset.records_count.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {dataset.format && (
                      <div className="flex items-center gap-2">
                        <div className="bg-muted-foreground/20 h-3 w-3 rounded" />
                        <div>
                          <div className="text-muted-foreground">Format</div>
                          <div className="font-medium uppercase">
                            {dataset.format}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {dataset.tags && dataset.tags.length > 0 && (
                    <div>
                      <div className="text-muted-foreground mb-1 text-xs">
                        Tags
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dataset.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {dataset.tags.length > 4 && (
                          <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
                            +{dataset.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    );
  } else {
    // Render datasets as a table with checkboxes and hover effects
    content = (
      <Table className="py-3">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Records</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Select</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDatasets.map((dataset) => {
            const isSelected = selectedDatasets.some(
              (d) => d.id === dataset.id,
            );
            return (
              <TableRow
                key={dataset.id}
                className={cn(
                  'cursor-pointer transition-colors',
                  isSelected && 'bg-primary/5',
                )}
                onClick={() => onSelect(dataset)}
              >
                <TableCell className="max-w-0">
                  <HoverCard openDelay={300}>
                    <HoverCardTrigger asChild>
                      <span
                        className="cursor-pointer truncate"
                        title={dataset.name}
                      >
                        {truncateText(dataset.name, 30)}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="right">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">
                          {dataset.name}
                        </h4>
                        {dataset.created_at && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">
                              Created:{' '}
                            </span>
                            <span className="font-medium">
                              {formatDate(dataset.created_at)}
                            </span>
                          </div>
                        )}
                        {dataset.tags && dataset.tags.length > 0 && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">
                              Tags:{' '}
                            </span>
                            <span className="font-medium">
                              {dataset.tags.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {dataset.records_count
                    ? dataset.records_count.toLocaleString()
                    : 'Unknown'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatFileSize(dataset.size)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <input
                      aria-checked={isSelected}
                      checked={isSelected}
                      onChange={() => onSelect(dataset)}
                      type="checkbox"
                      className="cursor-pointer"
                    />
                    {isSelected && (
                      <CheckCircle2 className="text-primary animate-in zoom-in-75 ml-2 h-4 w-4 duration-200" />
                    )}
                  </div>
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
