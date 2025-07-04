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
import type { Model } from '../../sidebar/services/model-service';
import { fetchAllModels } from '../../sidebar/services/model-service';

interface ModelListProps {
  onSelect: (model: Model) => void;
  search: string;
  selectedModel?: Model;
  view: 'grid' | 'table';
}

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
            <Card
              className={`cursor-pointer border-2 p-4 ${
                isSelected ? 'border-primary' : 'border-transparent'
              }`}
              key={model.model_tag}
              onClick={() => onSelect(model)}
            >
              <p className="text-sm font-medium">
                {/* Truncate long model names for display */}
                {model.name.length > 17
                  ? model.name.slice(0, 17) + '...'
                  : model.name}
              </p>
              {isSelected && (
                <span className="text-primary text-xs">Selected</span>
              )}
            </Card>
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
          <TableHead>Select</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredModels.map((model) => {
          const isSelected = selectedModel?.model_tag === model.model_tag;
          return (
            <TableRow key={model.model_tag}>
              <TableCell>
                {/* Truncate long model names for display */}
                {model.name.length > 17
                  ? model.name.slice(0, 17) + '...'
                  : model.name}
              </TableCell>
              <TableCell>
                <input
                  aria-checked={isSelected}
                  checked={isSelected}
                  name="model-select"
                  onChange={() => onSelect(model)}
                  type="radio"
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
