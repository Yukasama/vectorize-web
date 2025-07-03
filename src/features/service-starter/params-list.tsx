'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Dataset } from '../sidebar/services/dataset-service';
import { Model } from '../sidebar/services/model-service';
import { startTraining } from './training-service';

interface TrainingParamsStepProps {
  onBack: () => void;
  onReset: () => void;
  selectedDatasets: Dataset[];
  selectedModel?: Model;
  setTrainingParams: (params: { batchSize: number; epochs: number }) => void;
  trainingParams: { batchSize: number; epochs: number };
}
export const TrainingParamsStep = ({
  onBack,
  onReset,
  selectedDatasets,
  selectedModel,
  setTrainingParams,
  trainingParams,
}: TrainingParamsStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const queryClient = useQueryClient();

  // All training parameters (initially from props)
  const [epochs, setEpochs] = useState<'' | number>(
    trainingParams.epochs || '',
  );
  const [perDeviceTrainBatchSize, setPerDeviceTrainBatchSize] = useState<
    '' | number
  >(trainingParams.batchSize || '');
  const [learningRate, setLearningRate] = useState<'' | number>('');
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
  const [saveOptimizerState] = useState(false);
  const [dataloaderNumWorkers, setDataloaderNumWorkers] = useState<'' | number>(
    '',
  );
  const [device, setDevice] = useState('');
  const [timeoutSeconds, setTimeoutSeconds] = useState<'' | number>('');
  const [valDatasetId, setValDatasetId] = useState<string>('');

  const handleStart = async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      await startTraining({
        dataloader_num_workers:
          dataloaderNumWorkers === ''
            ? undefined
            : Number(dataloaderNumWorkers),
        device: device || undefined,
        epochs: epochs === '' ? undefined : Number(epochs),
        evaluation_steps:
          evaluationSteps === '' ? undefined : Number(evaluationSteps),
        learning_rate: learningRate === '' ? undefined : Number(learningRate),
        max_grad_norm: maxGradNorm === '' ? undefined : Number(maxGradNorm),
        model_tag: selectedModel?.model_tag ?? '',
        optimizer_name: optimizerName || undefined,
        output_path: outputPath || undefined,
        per_device_train_batch_size:
          perDeviceTrainBatchSize === ''
            ? undefined
            : Number(perDeviceTrainBatchSize),
        save_best_model: saveBestModel,
        save_each_epoch: saveEachEpoch,
        save_optimizer_state: saveOptimizerState,
        scheduler: scheduler || undefined,
        show_progress_bar: showProgressBar,
        timeout_seconds:
          timeoutSeconds === '' ? undefined : Number(timeoutSeconds),
        train_dataset_ids: selectedDatasets.map((d) => d.id),
        use_amp: useAmp,
        val_dataset_id: valDatasetId || undefined,
        warmup_steps: warmupSteps === '' ? undefined : Number(warmupSteps),
        weight_decay: weightDecay === '' ? undefined : Number(weightDecay),
      });
      const { toast } = await import('sonner');
      toast.success('Training started!');
      void queryClient.invalidateQueries({ exact: false, queryKey: ['tasks'] });

      // Reset all parameters to default values
      setEpochs('');
      setPerDeviceTrainBatchSize('');
      setLearningRate('');
      setWarmupSteps('');
      setOptimizerName('');
      setScheduler('');
      setWeightDecay('');
      setMaxGradNorm('');
      setUseAmp(false);
      setShowProgressBar(true);
      setEvaluationSteps('');
      setOutputPath('');
      setSaveBestModel(true);
      setSaveEachEpoch(false);
      setDataloaderNumWorkers('');
      setDevice('');
      setTimeoutSeconds('');
      setValDatasetId('');

      onReset();
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
    setTrainingParams({
      batchSize:
        perDeviceTrainBatchSize === '' ? 0 : Number(perDeviceTrainBatchSize),
      epochs: epochs === '' ? 0 : Number(epochs),
    });
  }, [epochs, perDeviceTrainBatchSize, setTrainingParams]);

  return (
    <div className="px-8 py-6">
      <h2 className="mb-6 text-lg font-semibold">Training Parameters</h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        {/* First row: Epochs, Batch Size, Learning Rate */}
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="epochs-input"
          >
            Epochs
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="epochs-input"
            min={1}
            onChange={(e) =>
              setEpochs(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="e.g. 3"
            type="number"
            value={epochs === '' ? '' : epochs}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="batch-size-input"
          >
            Batch size per device
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="batch-size-input"
            min={1}
            onChange={(e) =>
              setPerDeviceTrainBatchSize(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 16"
            type="number"
            value={
              perDeviceTrainBatchSize === '' ? '' : perDeviceTrainBatchSize
            }
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="learning-rate-input"
          >
            Learning rate
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="learning-rate-input"
            min={0}
            onChange={(e) =>
              setLearningRate(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 0.0001"
            step="any"
            type="number"
            value={learningRate === '' ? '' : learningRate}
          />
        </div>
        <div className="col-span-full">
          <Separator className="my-2" />
        </div>
        {/* Second row: Warmup Steps, Optimizer, Scheduler */}
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="warmup-steps-input"
          >
            Warmup steps
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="warmup-steps-input"
            min={0}
            onChange={(e) =>
              setWarmupSteps(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 100"
            type="number"
            value={warmupSteps === '' ? '' : warmupSteps}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="optimizer-input"
          >
            Optimizer
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="optimizer-input"
            onChange={(e) => setOptimizerName(e.target.value)}
            placeholder="e.g. AdamW"
            type="text"
            value={optimizerName}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="scheduler-input"
          >
            Scheduler
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="scheduler-input"
            onChange={(e) => setScheduler(e.target.value)}
            placeholder="e.g. linear"
            type="text"
            value={scheduler}
          />
        </div>
        <div className="col-span-full">
          <Separator className="my-2" />
        </div>
        {/* Third row: Weight Decay, Max Grad Norm, Evaluation Steps */}
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="weight-decay-input"
          >
            Weight decay
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="weight-decay-input"
            min={0}
            onChange={(e) =>
              setWeightDecay(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 0.01"
            step="any"
            type="number"
            value={weightDecay === '' ? '' : weightDecay}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="max-grad-norm-input"
          >
            Max grad norm
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="max-grad-norm-input"
            min={0}
            onChange={(e) =>
              setMaxGradNorm(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 1.0"
            step="any"
            type="number"
            value={maxGradNorm === '' ? '' : maxGradNorm}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="evaluation-steps-input"
          >
            Evaluation steps
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="evaluation-steps-input"
            min={0}
            onChange={(e) =>
              setEvaluationSteps(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 100"
            type="number"
            value={evaluationSteps === '' ? '' : evaluationSteps}
          />
        </div>
        <div className="col-span-full">
          <Separator className="my-2" />
        </div>
        {/* Fourth row: Output Path, Dataloader Workers, Device */}
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="output-path-input"
          >
            Output path
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="output-path-input"
            onChange={(e) => setOutputPath(e.target.value)}
            placeholder="path/to/output"
            type="text"
            value={outputPath}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="dataloader-workers-input"
          >
            Dataloader workers
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="dataloader-workers-input"
            min={0}
            onChange={(e) =>
              setDataloaderNumWorkers(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 4"
            type="number"
            value={dataloaderNumWorkers === '' ? '' : dataloaderNumWorkers}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="device-input"
          >
            Device
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="device-input"
            onChange={(e) => setDevice(e.target.value)}
            placeholder="cpu, cuda, ..."
            type="text"
            value={device}
          />
        </div>
        <div className="col-span-full">
          <Separator className="my-2" />
        </div>
        {/* Fifth row: Timeout, Checkboxes */}
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="timeout-seconds-input"
          >
            Timeout (seconds)
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="timeout-seconds-input"
            min={0}
            onChange={(e) =>
              setTimeoutSeconds(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="e.g. 3600"
            type="number"
            value={timeoutSeconds === '' ? '' : timeoutSeconds}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="val-dataset-id-input"
          >
            Validation dataset ID (optional)
          </label>
          <input
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/30 w-full rounded border border-white/80 bg-white px-3 py-2 text-sm text-black shadow-sm transition placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            id="val-dataset-id-input"
            onChange={(e) => setValDatasetId(e.target.value)}
            placeholder="Dataset ID or leave empty for 10% split"
            type="text"
            value={valDatasetId}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <input
              checked={!!useAmp}
              className="accent-primary focus:ring-primary/30 rounded border border-white/80 focus:ring-2"
              id="use-amp"
              onChange={(e) => setUseAmp(e.target.checked)}
              type="checkbox"
            />
            <label
              className="cursor-pointer text-sm font-medium select-none"
              htmlFor="use-amp"
            >
              Use AMP
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              checked={!!showProgressBar}
              className="accent-primary focus:ring-primary/30 rounded border border-white/80 focus:ring-2"
              id="show-progress-bar"
              onChange={(e) => setShowProgressBar(e.target.checked)}
              type="checkbox"
            />
            <label
              className="cursor-pointer text-sm font-medium select-none"
              htmlFor="show-progress-bar"
            >
              Show progress bar
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              checked={!!saveBestModel}
              className="accent-primary focus:ring-primary/30 rounded border border-white/80 focus:ring-2"
              id="save-best-model"
              onChange={(e) => setSaveBestModel(e.target.checked)}
              type="checkbox"
            />
            <label
              className="cursor-pointer text-sm font-medium select-none"
              htmlFor="save-best-model"
            >
              Save best model
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              checked={!!saveEachEpoch}
              className="accent-primary focus:ring-primary/30 rounded border border-white/80 focus:ring-2"
              id="save-each-epoch"
              onChange={(e) => setSaveEachEpoch(e.target.checked)}
              type="checkbox"
            />
            <label
              className="cursor-pointer text-sm font-medium select-none"
              htmlFor="save-each-epoch"
            >
              Save each epoch
            </label>
          </div>
        </div>
      </div>
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
          {isSubmitting ? 'Starting...' : 'Start training'}
        </Button>
      </div>
    </div>
  );
};
