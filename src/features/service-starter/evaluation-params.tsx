'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQueryClient } from '@tanstack/react-query';
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
      void queryClient.invalidateQueries({ exact: false, queryKey: ['tasks'] });

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
    <div className="px-8 py-6">
      <h2 className="mb-6 text-lg font-semibold">Evaluation Parameters</h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="max-samples-input"
          >
            Max samples
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="max-samples-input"
            min={1}
            onChange={(e) => setMaxSamples(Number(e.target.value))}
            placeholder="e.g. 1000"
            type="number"
            value={maxSamples}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="baseline-model-tag-input"
          >
            Baseline model tag (optional)
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="baseline-model-tag-input"
            onChange={(e) => setBaselineModelTag(e.target.value)}
            placeholder="e.g. my-baseline-model"
            type="text"
            value={baselineModelTag}
          />
        </div>
      </div>
      <Separator className="my-2" />
      {/* Display error message if present */}
      {error && <div className="mt-4 text-red-500">{error}</div>}
      <div className="mt-6 flex gap-2">
        <Button disabled={isSubmitting} onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          disabled={
            isSubmitting || !selectedModel || selectedDatasets.length === 0
          }
          onClick={handleStart}
        >
          {isSubmitting ? 'Starting...' : 'Start evaluation'}
        </Button>
      </div>
    </div>
  );
};
export default EvaluationParamsStep;
