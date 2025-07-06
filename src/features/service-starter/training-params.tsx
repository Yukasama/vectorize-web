'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Settings2 } from 'lucide-react';
import React, { useState } from 'react';
import { Dataset } from '../sidebar/services/dataset-service';
import { Model } from '../sidebar/services/model-service';
import { startTraining } from './training-service';

/**
 * TrainingParamsStep allows users to configure and start a model training task.
 * Handles parameter input, validation, error display, and triggers training via service call.
 */

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
  // State for form fields and UI feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const queryClient = useQueryClient();

  // Base training parameters
  const [epochs, setEpochs] = useState<'' | number>(
    trainingParams.epochs || '',
  );
  const [perDeviceTrainBatchSize, setPerDeviceTrainBatchSize] = useState<
    '' | number
  >(trainingParams.batchSize || '');
  const [learningRate, setLearningRate] = useState<'' | number>('');
  const [valDatasetId, setValDatasetId] = useState<string>('');

  // Advanced parameters
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

  // Handles starting the training process
  const handleStart = async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      await startTraining({
        dataloader_num_workers:
          dataloaderNumWorkers === ''
            ? undefined
            : Number(dataloaderNumWorkers),
        device,
        epochs: epochs === '' ? undefined : Number(epochs),
        evaluation_steps:
          evaluationSteps === '' ? undefined : Number(evaluationSteps),
        learning_rate: learningRate === '' ? undefined : Number(learningRate),
        max_grad_norm: maxGradNorm === '' ? undefined : Number(maxGradNorm),
        model_tag: selectedModel?.model_tag ?? '',
        optimizer_name: optimizerName,
        output_path: outputPath,
        per_device_train_batch_size:
          perDeviceTrainBatchSize === ''
            ? undefined
            : Number(perDeviceTrainBatchSize),
        save_best_model: saveBestModel,
        save_each_epoch: saveEachEpoch,
        save_optimizer_state: saveOptimizerState,
        scheduler: scheduler,
        show_progress_bar: showProgressBar,
        timeout_seconds:
          timeoutSeconds === '' ? undefined : Number(timeoutSeconds),
        train_dataset_ids: selectedDatasets.map((d) => d.id),
        use_amp: useAmp,
        val_dataset_id: valDatasetId,
        warmup_steps: warmupSteps === '' ? undefined : Number(warmupSteps),
        weight_decay: weightDecay === '' ? undefined : Number(weightDecay),
      });
      // Show success toast and refresh tasks
      const { toast } = await import('sonner');
      toast.success('Training started!');
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ['tasks'],
      });

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
    setTrainingParams({
      batchSize:
        perDeviceTrainBatchSize === '' ? 0 : Number(perDeviceTrainBatchSize),
      epochs: epochs === '' ? 0 : Number(epochs),
    });
  }, [epochs, perDeviceTrainBatchSize, setTrainingParams]);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Base Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-md mb-4 flex items-center gap-2 font-medium">
              <Settings2 className="h-4 w-4" />
              Base Settings
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="epochs-input" className="text-sm font-medium">
                  Epochs
                </Label>
                <Input
                  id="epochs-input"
                  type="number"
                  min={1}
                  value={epochs === '' ? '' : epochs}
                  onChange={(e) =>
                    setEpochs(
                      e.target.value === '' ? '' : Number(e.target.value),
                    )
                  }
                  placeholder="e.g. 3"
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="batch-size-input"
                  className="text-sm font-medium"
                >
                  Batch Size per Device
                </Label>
                <Input
                  id="batch-size-input"
                  type="number"
                  min={1}
                  value={
                    perDeviceTrainBatchSize === ''
                      ? ''
                      : perDeviceTrainBatchSize
                  }
                  onChange={(e) =>
                    setPerDeviceTrainBatchSize(
                      e.target.value === '' ? '' : Number(e.target.value),
                    )
                  }
                  placeholder="e.g. 16"
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="learning-rate-input"
                  className="text-sm font-medium"
                >
                  Learning Rate
                </Label>
                <Input
                  id="learning-rate-input"
                  type="number"
                  min={0}
                  step="any"
                  value={learningRate === '' ? '' : learningRate}
                  onChange={(e) =>
                    setLearningRate(
                      e.target.value === '' ? '' : Number(e.target.value),
                    )
                  }
                  placeholder="e.g. 0.0001"
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label
                  htmlFor="val-dataset-id-input"
                  className="text-sm font-medium"
                >
                  Validation Dataset ID
                  <span className="text-muted-foreground ml-1">(optional)</span>
                </Label>
                <Input
                  id="val-dataset-id-input"
                  type="text"
                  value={valDatasetId}
                  onChange={(e) => setValDatasetId(e.target.value)}
                  placeholder="Dataset ID or leave empty for 10% split"
                  className="transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-0 hover:bg-transparent"
              >
                <h3 className="text-md flex items-center gap-2 font-medium">
                  <Settings2 className="h-4 w-4" />
                  Advanced Settings
                </h3>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showAdvanced ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Optimization Parameters */}
                <div className="space-y-2">
                  <Label
                    htmlFor="warmup-steps-input"
                    className="text-sm font-medium"
                  >
                    Warmup Steps
                  </Label>
                  <Input
                    id="warmup-steps-input"
                    type="number"
                    min={0}
                    value={warmupSteps === '' ? '' : warmupSteps}
                    onChange={(e) =>
                      setWarmupSteps(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 100"
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="optimizer-input"
                    className="text-sm font-medium"
                  >
                    Optimizer
                  </Label>
                  <Input
                    id="optimizer-input"
                    type="text"
                    value={optimizerName}
                    onChange={(e) => setOptimizerName(e.target.value)}
                    placeholder="e.g. AdamW"
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="scheduler-input"
                    className="text-sm font-medium"
                  >
                    Scheduler
                  </Label>
                  <Input
                    id="scheduler-input"
                    type="text"
                    value={scheduler}
                    onChange={(e) => setScheduler(e.target.value)}
                    placeholder="e.g. linear"
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="weight-decay-input"
                    className="text-sm font-medium"
                  >
                    Weight Decay
                  </Label>
                  <Input
                    id="weight-decay-input"
                    type="number"
                    min={0}
                    step="any"
                    value={weightDecay === '' ? '' : weightDecay}
                    onChange={(e) =>
                      setWeightDecay(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 0.01"
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="max-grad-norm-input"
                    className="text-sm font-medium"
                  >
                    Max Grad Norm
                  </Label>
                  <Input
                    id="max-grad-norm-input"
                    type="number"
                    min={0}
                    step="any"
                    value={maxGradNorm === '' ? '' : maxGradNorm}
                    onChange={(e) =>
                      setMaxGradNorm(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 1.0"
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="evaluation-steps-input"
                    className="text-sm font-medium"
                  >
                    Evaluation Steps
                  </Label>
                  <Input
                    id="evaluation-steps-input"
                    type="number"
                    min={0}
                    value={evaluationSteps === '' ? '' : evaluationSteps}
                    onChange={(e) =>
                      setEvaluationSteps(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 100"
                    className="transition-all duration-200"
                  />
                </div>

                {/* System Parameters */}
                <div className="space-y-2">
                  <Label
                    htmlFor="output-path-input"
                    className="text-sm font-medium"
                  >
                    Output Path
                  </Label>
                  <Input
                    id="output-path-input"
                    type="text"
                    value={outputPath}
                    onChange={(e) => setOutputPath(e.target.value)}
                    placeholder="path/to/output"
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="dataloader-workers-input"
                    className="text-sm font-medium"
                  >
                    Dataloader Workers
                  </Label>
                  <Input
                    id="dataloader-workers-input"
                    type="number"
                    min={0}
                    value={
                      dataloaderNumWorkers === '' ? '' : dataloaderNumWorkers
                    }
                    onChange={(e) =>
                      setDataloaderNumWorkers(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 4"
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="device-input" className="text-sm font-medium">
                    Device
                  </Label>
                  <Input
                    id="device-input"
                    type="text"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    placeholder="cpu, cuda, ..."
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="timeout-seconds-input"
                    className="text-sm font-medium"
                  >
                    Timeout (seconds)
                  </Label>
                  <Input
                    id="timeout-seconds-input"
                    type="number"
                    min={0}
                    value={timeoutSeconds === '' ? '' : timeoutSeconds}
                    onChange={(e) =>
                      setTimeoutSeconds(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 3600"
                    className="transition-all duration-200"
                  />
                </div>
              </div>

              {/* Toggle Options */}
              <div className="pt-4">
                <h4 className="mb-3 text-sm font-medium">Options</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="use-amp"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Use AMP (Automatic Mixed Precision)
                    </Label>
                    <Switch
                      id="use-amp"
                      checked={useAmp}
                      onCheckedChange={setUseAmp}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="show-progress-bar"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Show Progress Bar
                    </Label>
                    <Switch
                      id="show-progress-bar"
                      checked={showProgressBar}
                      onCheckedChange={setShowProgressBar}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="save-best-model"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Save Best Model
                    </Label>
                    <Switch
                      id="save-best-model"
                      checked={saveBestModel}
                      onCheckedChange={setSaveBestModel}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="save-each-epoch"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Save Each Epoch
                    </Label>
                    <Switch
                      id="save-each-epoch"
                      checked={saveEachEpoch}
                      onCheckedChange={setSaveEachEpoch}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
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
            {isSubmitting ? 'Starting...' : 'Start Training'}
          </Button>
        </div>
      </div>
    </div>
  );
};
