'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Dataset } from '../sidebar/services/dataset-service';
import { Model } from '../sidebar/services/model-service';

interface EvaluationParamsStepProps {
  evaluationParams: { baselineModelTag?: string; maxSamples: number };
  onBack: () => void;
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
  selectedDatasets,
  selectedModel,
  setEvaluationParams,
}: EvaluationParamsStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [maxSamples, setMaxSamples] = useState<number>(
    evaluationParams.maxSamples || 1000,
  );
  const [baselineModelTag, setBaselineModelTag] = useState<string>(
    evaluationParams.baselineModelTag ?? '',
  );
  const queryClient = useQueryClient();

  const handleStart = async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { startEvaluation } = await import('./evaluation-service');
      await startEvaluation({
        baseline_model_tag: baselineModelTag,
        dataset_id: selectedDatasets[0]?.id ?? undefined,
        max_samples: maxSamples,
        model_tag: selectedModel?.model_tag ?? '',
      });
      const { toast } = await import('sonner');
      toast.success('Evaluation started!');
      void queryClient.invalidateQueries({ exact: false, queryKey: ['tasks'] });
    } catch (error_) {
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
