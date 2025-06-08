'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useState } from 'react';
import { Dataset } from '../sidebar/services/dataset-service';
import { Model } from '../sidebar/services/model-service';

interface TrainingParamsStepProps {
  onBack: () => void;
  selectedDatasets: Dataset[];
  selectedModel?: Model;
  setTrainingParams: (params: { batchSize: number; epochs: number }) => void;
  trainingParams: { batchSize: number; epochs: number };
}
export const TrainingParamsStep = ({
  onBack,
  selectedDatasets,
  selectedModel,
  setTrainingParams,
  trainingParams,
}: TrainingParamsStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  // Example: Add more params as needed
  const [epochs, setEpochs] = useState(trainingParams.epochs || 3);
  const [batchSize, setBatchSize] = useState(trainingParams.batchSize || 16);

  const handleStart = async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      await axios.post('http://localhost:8000/v1/train', {
        batch_size: batchSize,
        dataset_ids: selectedDatasets.map((d) => d.id),
        epochs,
        model_tag: selectedModel?.id,
      });
      alert('Training started!');
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

  // Update parent state on param change
  React.useEffect(() => {
    setTrainingParams({ batchSize, epochs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epochs, batchSize]);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Training parameters</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Epochs</label>
        <input
          className="input input-bordered w-32"
          max={100}
          min={1}
          onChange={(e) => setEpochs(Number(e.target.value))}
          type="number"
          value={epochs}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Batch size</label>
        <input
          className="input input-bordered w-32"
          max={1024}
          min={1}
          onChange={(e) => setBatchSize(Number(e.target.value))}
          type="number"
          value={batchSize}
        />
      </div>
      {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
      <div className="mt-4 flex gap-2">
        <Button disabled={isSubmitting} onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          disabled={
            isSubmitting || !selectedModel || selectedDatasets.length === 0
          }
          onClick={handleStart}
        >
          {isSubmitting ? 'Starting...' : 'Start training'}
        </Button>
      </div>
    </div>
  );
};
