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
import { Activity, Calendar, CheckCircle2, Tag } from 'lucide-react';
import type { Model } from '../../sidebar/services/model-service';
import { fetchAllModels } from '../../sidebar/services/model-service';

interface ModelListProps {
  onSelect: (model: Model) => void;
  search: string;
  selectedModel?: Model;
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

// ModelList component displays a list of models in either grid or table view.
// It supports searching, selection, and handles loading/error states.
export const ModelList = ({
  onSelect,
  search,
  selectedModel,
  view,
}: ModelListProps) => {
  // Fetch all models using React Query
  const {
    data: models = [],
    error,
    isLoading,
  } = useQuery({
    queryFn: fetchAllModels,
    queryKey: ['models'],
  });

  // Filter models by search string (case-insensitive)
  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Show loading state while fetching models
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">Loading...</div>
    );
  }
  // Show error state if fetching models fails
  if (error) {
    return <div className="text-red-500">Error loading models.</div>;
  }
  // Show message if no models match the search
  if (filteredModels.length === 0) {
    return <div className="text-muted-foreground p-4">No models found.</div>;
  }

  // Render models in grid view
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-4 gap-4 px-4 py-3">
        {filteredModels.map((model) => {
          const isSelected = selectedModel?.model_tag === model.model_tag;
          return (
            <HoverCard key={model.model_tag} openDelay={300}>
              <HoverCardTrigger asChild>
                <Card
                  className={cn(
                    'relative cursor-pointer p-4 transition-all duration-200 hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-primary/20 scale-105 ring-2'
                      : 'border-border hover:border-primary/50 hover:bg-accent/20',
                  )}
                  onClick={() => onSelect(model)}
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
                      title={model.name}
                    >
                      {truncateText(model.name, 25)}
                    </p>

                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Tag className="h-3 w-3" />
                      <span>{truncateText(model.model_tag, 15)}</span>
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
                    <h4 className="text-sm font-semibold">{model.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="text-muted-foreground h-3 w-3" />
                      <div>
                        <div className="text-muted-foreground">Tag</div>
                        <div className="font-medium">{model.model_tag}</div>
                      </div>
                    </div>

                    {model.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-3 w-3" />
                        <div>
                          <div className="text-muted-foreground">Created</div>
                          <div className="font-medium">
                            {formatDate(model.created_at)}
                          </div>
                        </div>
                      </div>
                    )}

                    {model.status && (
                      <div className="flex items-center gap-2">
                        <Activity className="text-muted-foreground h-3 w-3" />
                        <div>
                          <div className="text-muted-foreground">Status</div>
                          <div className="font-medium capitalize">
                            {model.status}
                          </div>
                        </div>
                      </div>
                    )}

                    {model.size && (
                      <div className="flex items-center gap-2">
                        <div className="bg-muted-foreground/20 h-3 w-3 rounded" />
                        <div>
                          <div className="text-muted-foreground">Size</div>
                          <div className="font-medium">{model.size}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {model.metrics && Object.keys(model.metrics).length > 0 && (
                    <div>
                      <div className="text-muted-foreground mb-1 text-xs">
                        Metrics
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(model.metrics)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <span
                              key={key}
                              className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs"
                            >
                              {key}: {String(value)}
                            </span>
                          ))}
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
  }

  // Render models in table view
  return (
    <Table className="px-0 py-3">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Select</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredModels.map((model) => {
          const isSelected = selectedModel?.model_tag === model.model_tag;
          return (
            <TableRow
              key={model.model_tag}
              className={cn(
                'cursor-pointer transition-colors',
                isSelected && 'bg-primary/5',
              )}
              onClick={() => onSelect(model)}
            >
              <TableCell>
                <HoverCard openDelay={300}>
                  <HoverCardTrigger asChild>
                    <span className="cursor-pointer">
                      {truncateText(model.name, 25)}
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" side="right">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{model.name}</h4>
                      {model.created_at && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            Created:{' '}
                          </span>
                          <span className="font-medium">
                            {formatDate(model.created_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {truncateText(model.model_tag, 20)}
              </TableCell>
              <TableCell>
                <span className="text-sm capitalize">
                  {model.status || 'Unknown'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <input
                    aria-checked={isSelected}
                    checked={isSelected}
                    name="model-select"
                    onChange={() => onSelect(model)}
                    type="radio"
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
};
