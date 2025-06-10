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

  // All training parameters
  const [epochs, setEpochs] = useState(trainingParams.epochs || 1);
  const [perDeviceTrainBatchSize, setPerDeviceTrainBatchSize] = useState(8);
  const [learningRate, setLearningRate] = useState(2e-5);
  const [warmupSteps, setWarmupSteps] = useState<'' | number>('');
  const [optimizerName, setOptimizerName] = useState('');
  const [scheduler, setScheduler] = useState('');
  const [weightDecay, setWeightDecay] = useState<'' | number>('');
  const [maxGradNorm, setMaxGradNorm] = useState<'' | number>('');
  const [useAmp, setUseAmp] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [evaluationSteps, setEvaluationSteps] = useState<'' | number>('');
  const [outputPath, setOutputPath] = useState('');
  const [saveBestModel, setSaveBestModel] = useState(true);
  const [saveEachEpoch, setSaveEachEpoch] = useState(false);
  const [saveOptimizerState, setSaveOptimizerState] = useState(false);
  const [dataloaderNumWorkers, setDataloaderNumWorkers] = useState<'' | number>(
    '',
  );
  const [device, setDevice] = useState('');
  const [timeoutSeconds, setTimeoutSeconds] = useState<'' | number>('');

  const handleStart = async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      await axios.post('http://localhost:8000/v1/training/train', {
        dataloader_num_workers:
          dataloaderNumWorkers === ''
            ? undefined
            : Number(dataloaderNumWorkers),
        device: device || undefined,
        epochs,
        evaluation_steps:
          evaluationSteps === '' ? undefined : Number(evaluationSteps),
        learning_rate: learningRate,
        max_grad_norm: maxGradNorm === '' ? undefined : Number(maxGradNorm),
        model_tag: selectedModel?.model_tag,
        optimizer_name: optimizerName || undefined,
        output_path: outputPath || undefined,
        per_device_train_batch_size: perDeviceTrainBatchSize,
        save_best_model: saveBestModel,
        save_each_epoch: saveEachEpoch,
        save_optimizer_state: saveOptimizerState,
        scheduler: scheduler || undefined,
        show_progress_bar: showProgressBar,
        timeout_seconds:
          timeoutSeconds === '' ? undefined : Number(timeoutSeconds),
        train_dataset_ids: selectedDatasets.map((d) => d.id),
        use_amp: useAmp,
        val_dataset_id: undefined,
        warmup_steps: warmupSteps === '' ? undefined : Number(warmupSteps),
        weight_decay: weightDecay === '' ? undefined : Number(weightDecay),
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
    setTrainingParams({ batchSize: perDeviceTrainBatchSize, epochs });
  }, [epochs, perDeviceTrainBatchSize, setTrainingParams]);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Training parameters</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Epochs</label>
        <input
          className="input input-bordered w-32"
          min={1}
          onChange={(e) => setEpochs(Number(e.target.value))}
          type="number"
          value={epochs}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">
          Batch size per device
        </label>
        <input
          className="input input-bordered w-32"
          min={1}
          onChange={(e) => setPerDeviceTrainBatchSize(Number(e.target.value))}
          type="number"
          value={perDeviceTrainBatchSize}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Learning rate</label>
        <input
          className="input input-bordered w-32"
          onChange={(e) => setLearningRate(Number(e.target.value))}
          step="any"
          type="number"
          value={learningRate}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Warmup steps</label>
        <input
          className="input input-bordered w-32"
          min={0}
          onChange={(e) =>
            setWarmupSteps(e.target.value === '' ? '' : Number(e.target.value))
          }
          type="number"
          value={warmupSteps}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Optimizer</label>
        <input
          className="input input-bordered w-32"
          onChange={(e) => setOptimizerName(e.target.value)}
          type="text"
          value={optimizerName}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Scheduler</label>
        <input
          className="input input-bordered w-32"
          onChange={(e) => setScheduler(e.target.value)}
          type="text"
          value={scheduler}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Weight decay</label>
        <input
          className="input input-bordered w-32"
          onChange={(e) =>
            setWeightDecay(e.target.value === '' ? '' : Number(e.target.value))
          }
          step="any"
          type="number"
          value={weightDecay}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Max grad norm</label>
        <input
          className="input input-bordered w-32"
          onChange={(e) =>
            setMaxGradNorm(e.target.value === '' ? '' : Number(e.target.value))
          }
          step="any"
          type="number"
          value={maxGradNorm}
        />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <label className="block text-sm font-medium">Use AMP</label>
        <input
          checked={useAmp}
          onChange={(e) => setUseAmp(e.target.checked)}
          type="checkbox"
        />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <label className="block text-sm font-medium">Show progress bar</label>
        <input
          checked={showProgressBar}
          onChange={(e) => setShowProgressBar(e.target.checked)}
          type="checkbox"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Evaluation steps</label>
        <input
          className="input input-bordered w-32"
          min={0}
          onChange={(e) =>
            setEvaluationSteps(
              e.target.value === '' ? '' : Number(e.target.value),
            )
          }
          type="number"
          value={evaluationSteps}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Output path</label>
        <input
          className="input input-bordered w-32"
          onChange={(e) => setOutputPath(e.target.value)}
          type="text"
          value={outputPath}
        />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <label className="block text-sm font-medium">Save best model</label>
        <input
          checked={saveBestModel}
          onChange={(e) => setSaveBestModel(e.target.checked)}
          type="checkbox"
        />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <label className="block text-sm font-medium">Save each epoch</label>
        <input
          checked={saveEachEpoch}
          onChange={(e) => setSaveEachEpoch(e.target.checked)}
          type="checkbox"
        />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <label className="block text-sm font-medium">
          Save optimizer state
        </label>
        <input
          checked={saveOptimizerState}
          onChange={(e) => setSaveOptimizerState(e.target.checked)}
          type="checkbox"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">
          Dataloader num workers
        </label>
        <input
          className="input input-bordered w-32"
          min={0}
          onChange={(e) =>
            setDataloaderNumWorkers(
              e.target.value === '' ? '' : Number(e.target.value),
            )
          }
          type="number"
          value={dataloaderNumWorkers}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Device</label>
        <input
          className="input input-bordered w-32"
          onChange={(e) => setDevice(e.target.value)}
          type="text"
          value={device}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Timeout seconds</label>
        <input
          className="input input-bordered w-32"
          min={0}
          onChange={(e) =>
            setTimeoutSeconds(
              e.target.value === '' ? '' : Number(e.target.value),
            )
          }
          type="number"
          value={timeoutSeconds}
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
