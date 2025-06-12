import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Model } from '../../sidebar/services/model-service';

interface ModelListProps {
  loading?: boolean;
  models: Model[];
  onSelect: (model: Model) => void;
  selectedModel?: Model;
  view: 'grid' | 'table';
}

export const ModelList = ({
  loading,
  models,
  onSelect,
  selectedModel,
  view,
}: ModelListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">Loading...</div>
    );
  }

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-4 gap-4 px-4 py-3">
        {models.map((model) => {
          const isSelected = selectedModel?.id === model.id;
          return (
            <Card
              className={`cursor-pointer border-2 p-4 ${isSelected ? 'border-primary' : 'border-transparent'}`}
              key={model.id}
              onClick={() => onSelect(model)}
            >
              <p className="text-sm font-medium">
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

  return (
    <Table className="px-0 py-3">
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
              <TableCell>
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
