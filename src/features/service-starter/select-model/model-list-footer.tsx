'use client';

import { Button } from '@/components/ui/button';
import type { Model } from '../../sidebar/services/model-service';

interface ModelListFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  selectedModel?: Model;
}

export const ModelListFooter = ({
  onBack,
  onNext,
  selectedModel,
}: ModelListFooterProps) => (
  <div className="sticky bottom-0 left-0 z-10 flex w-full items-center justify-between border-t px-4 py-3">
    <div>
      {/* Render Back button if onBack handler is provided */}
      {onBack && (
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
      )}
    </div>
    <div className="flex items-center gap-2">
      {/* Render Next button if onNext handler is provided; disable if no model is selected */}
      {onNext && (
        <Button disabled={!selectedModel} onClick={onNext} variant="default">
          Next
        </Button>
      )}
    </div>
  </div>
);
