import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Model } from '../../sidebar/services/model-service';

interface ModelListFooterProps {
  onBack?: () => void;
  onClearSelected: () => void;
  onNext?: () => void;
  selectedModel?: Model;
}

export const ModelListFooter = ({
  onBack,
  onClearSelected,
  onNext,
  selectedModel,
}: ModelListFooterProps) => (
  <div className="sticky bottom-0 left-0 z-10 flex w-full items-center justify-between border-t px-4 py-3">
    <div>
      {onBack && (
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
      )}
    </div>
    <div className="flex items-center gap-2">
      {selectedModel && (
        <span className="bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs font-medium">
          {selectedModel.name}
          <button
            aria-label="Remove selected model"
            className="text-muted-foreground hover:text-destructive ml-1"
            onClick={onClearSelected}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </span>
      )}
      {onNext && (
        <Button disabled={!selectedModel} onClick={onNext} variant="default">
          Next
        </Button>
      )}
    </div>
  </div>
);
