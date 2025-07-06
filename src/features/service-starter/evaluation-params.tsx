'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQueryClient } from '@tanstack/react-query';
import { Settings2 } from 'lucide-react';
import React, { useState } from 'react';
import { Dataset } from '../sidebar/services/dataset-service';
import { Model } from '../sidebar/services/model-service';

/**
 * EvaluationParamsStep allows users to configure and start an evaluation task.
 * Handles parameter input, validation, error display, and triggers evaluation via service call.
 */
interface EvaluationParamsStepProps {
  evaluationParams: { baselineModelTag?: string; maxSamples: number };
  onBack: () => void;
  onReset: () => void;
  selectedDatasets: Dataset[];
  selectedModel?: Model;
  setEvaluationParams: (params: {
    baselineModelTag?: string;
    maxSamples: number;
  }) => void;
}

export const EvaluationParamsStep = ({
  evaluationParams,
  onBack,
  onReset,
  selectedDatasets,
  selectedModel,
  setEvaluationParams,
}: EvaluationParamsStepProps) => {
  // State for form fields and UI feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [maxSamples, setMaxSamples] = useState<number>(
    evaluationParams.maxSamples || 1000,
  );
  const [baselineModelTag, setBaselineModelTag] = useState<string>(
    evaluationParams.baselineModelTag ?? '',
  );
  const queryClient = useQueryClient();

  // Handles starting the evaluation process
  const handleStart = async () => {
    setIsSubmitting(true);
    setError(undefined);

    // Only one dataset can be selected for evaluation
    if (selectedDatasets.length > 1) {
      setError('Please select only one dataset for evaluation.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Dynamically import evaluation service to start evaluation
      const { startEvaluation } = await import('./evaluation-service');
      await startEvaluation({
        baseline_model_tag: baselineModelTag,
        dataset_id: selectedDatasets[0]?.id ?? undefined,
        max_samples: maxSamples,
        model_tag: selectedModel?.model_tag ?? '',
      });
      // Show success toast and refresh tasks
      const { toast } = await import('sonner');
      toast.success('Evaluation started!');
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ['tasks'],
      });

      // Reset all parameters to default values
      setMaxSamples(1000);
      setBaselineModelTag('');

      onReset();
    } catch (error_) {
      // Robust error handling with user-friendly message
      const err: {
        message?: string;
        response?: { data?: { message?: string } };
      } = error_ as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      setError(err.response?.data?.message ?? err.message ?? 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keep parent state in sync with local changes
  React.useEffect(() => {
    setEvaluationParams({
      baselineModelTag,
      maxSamples,
    });
  }, [maxSamples, baselineModelTag, setEvaluationParams]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Evaluation Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-md mb-4 flex items-center gap-2 font-medium">
              <Settings2 className="h-4 w-4" />
              Evaluation Settings
            </h3>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="max-samples-input"
                >
                  Max Samples
                </Label>
                <Input
                  className="transition-all duration-200"
                  id="max-samples-input"
                  min={1}
                  onChange={(e) => setMaxSamples(Number(e.target.value))}
                  placeholder="e.g. 1000"
                  type="number"
                  value={maxSamples}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="baseline-model-tag-input"
                >
                  Baseline Model Tag
                  <span className="text-muted-foreground ml-1">(optional)</span>
                </Label>
                <Input
                  className="transition-all duration-200"
                  id="baseline-model-tag-input"
                  onChange={(e) => setBaselineModelTag(e.target.value)}
                  placeholder="e.g. my-baseline-model"
                  type="text"
                  value={baselineModelTag}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Display error message if present */}
        {error && (
          <div className="bg-destructive/10 border-destructive/20 mt-6 rounded-md border p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Add bottom padding to ensure content doesn't get hidden behind the footer */}
        <div className="pb-20" />
      </div>

      {/* Sticky footer with buttons */}
      <div className="bg-background sticky bottom-0 left-0 z-10 flex w-full items-center justify-between rounded-lg border-t px-4 py-3">
        <div>
          <Button disabled={isSubmitting} onClick={onBack} variant="outline">
            Back
          </Button>
        </div>
        <div>
          <Button disabled={isSubmitting} onClick={handleStart}>
            {isSubmitting ? 'Starting...' : 'Start Evaluation'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationParamsStep;
