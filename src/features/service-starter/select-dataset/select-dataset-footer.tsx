import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Dataset } from '../../sidebar/services/dataset-service';

interface DatasetListFooterProps {
  onBack?: () => void;
  onClearSelected: (id: string) => void;
  onNext?: () => void;
  selectedDatasets: Dataset[];
}

export const DatasetListFooter = ({
  onBack,
  onClearSelected,
  onNext,
  selectedDatasets,
}: DatasetListFooterProps) => (
  <div className="sticky bottom-0 left-0 z-10 flex w-full items-center justify-between border-t px-4 py-3">
    <div>
      {onBack && (
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
      )}
    </div>
    <div className="flex items-center gap-2">
      {selectedDatasets.length > 0 && (
        <span className="bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs font-medium">
          {selectedDatasets.map((ds) => (
            <span className="flex items-center gap-1" key={ds.id}>
              {ds.name}
              <button
                aria-label={`Remove selected dataset ${ds.name}`}
                className="text-muted-foreground hover:text-destructive ml-1"
                onClick={() => onClearSelected(ds.id)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </span>
      )}
      {onNext && (
        <Button
          disabled={selectedDatasets.length === 0}
          onClick={onNext}
          variant="default"
        >
          Next
        </Button>
      )}
    </div>
  </div>
);
