'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
                <Label className="text-sm font-medium" htmlFor="epochs-input">
                  Epochs
                </Label>
                <Input
                  className="transition-all duration-200"
                  id="epochs-input"
                  min={1}
                  onChange={(e) =>
                    setEpochs(
                      e.target.value === '' ? '' : Number(e.target.value),
                    )
                  }
                  placeholder="e.g. 3"
                  type="number"
                  value={epochs === '' ? '' : epochs}
                />
              </div>

              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="batch-size-input"
                >
                  Batch Size per Device
                </Label>
                <Input
                  className="transition-all duration-200"
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
                    perDeviceTrainBatchSize === ''
                      ? ''
                      : perDeviceTrainBatchSize
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="learning-rate-input"
                >
                  Learning Rate
                </Label>
                <Input
                  className="transition-all duration-200"
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

              <div className="space-y-2 lg:col-span-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="val-dataset-id-input"
                >
                  Validation Dataset ID
                  <span className="text-muted-foreground ml-1">(optional)</span>
                </Label>
                <Input
                  className="transition-all duration-200"
                  id="val-dataset-id-input"
                  onChange={(e) => setValDatasetId(e.target.value)}
                  placeholder="Dataset ID or leave empty for 10% split"
                  type="text"
                  value={valDatasetId}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <Collapsible onOpenChange={setShowAdvanced} open={showAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                className="flex items-center gap-2 p-0 hover:bg-transparent"
                size="sm"
                variant="ghost"
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
                    className="text-sm font-medium"
                    htmlFor="warmup-steps-input"
                  >
                    Warmup Steps
                  </Label>
                  <Input
                    className="transition-all duration-200"
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

                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="optimizer-input"
                  >
                    Optimizer
                  </Label>
                  <Input
                    className="transition-all duration-200"
                    id="optimizer-input"
                    onChange={(e) => setOptimizerName(e.target.value)}
                    placeholder="e.g. AdamW"
                    type="text"
                    value={optimizerName}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="scheduler-input"
                  >
                    Scheduler
                  </Label>
                  <Input
                    className="transition-all duration-200"
                    id="scheduler-input"
                    onChange={(e) => setScheduler(e.target.value)}
                    placeholder="e.g. linear"
                    type="text"
                    value={scheduler}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="weight-decay-input"
                  >
                    Weight Decay
                  </Label>
                  <Input
                    className="transition-all duration-200"
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

                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="max-grad-norm-input"
                  >
                    Max Grad Norm
                  </Label>
                  <Input
                    className="transition-all duration-200"
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

                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="evaluation-steps-input"
                  >
                    Evaluation Steps
                  </Label>
                  <Input
                    className="transition-all duration-200"
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

                {/* System Parameters */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="output-path-input"
                  >
                    Output Path
                  </Label>
                  <Input
                    className="transition-all duration-200"
                    id="output-path-input"
                    onChange={(e) => setOutputPath(e.target.value)}
                    placeholder="path/to/output"
                    type="text"
                    value={outputPath}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="dataloader-workers-input"
                  >
                    Dataloader Workers
                  </Label>
                  <Input
                    className="transition-all duration-200"
                    id="dataloader-workers-input"
                    min={0}
                    onChange={(e) =>
                      setDataloaderNumWorkers(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 4"
                    type="number"
                    value={
                      dataloaderNumWorkers === '' ? '' : dataloaderNumWorkers
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="device-input">
                    Device
                  </Label>
                  <Input
                    className="transition-all duration-200"
                    id="device-input"
                    onChange={(e) => setDevice(e.target.value)}
                    placeholder="cpu, cuda, ..."
                    type="text"
                    value={device}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    htmlFor="timeout-seconds-input"
                  >
                    Timeout (seconds)
                  </Label>
                  <Input
                    className="transition-all duration-200"
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
              </div>

              {/* Toggle Options */}
              <div className="pt-4">
                <div className="grid grid-cols-1 gap-4 gap-x-7 md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={useAmp}
                      id="use-amp"
                      onCheckedChange={setUseAmp}
                    />
                    <Label
                      className="cursor-pointer text-sm font-medium"
                      htmlFor="use-amp"
                    >
                      Use AMP (Automatic Mixed Precision)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={showProgressBar}
                      id="show-progress-bar"
                      onCheckedChange={setShowProgressBar}
                    />
                    <Label
                      className="cursor-pointer text-sm font-medium"
                      htmlFor="show-progress-bar"
                    >
                      Show Progress Bar
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={saveBestModel}
                      id="save-best-model"
                      onCheckedChange={setSaveBestModel}
                    />
                    <Label
                      className="cursor-pointer text-sm font-medium"
                      htmlFor="save-best-model"
                    >
                      Save Best Model
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={saveEachEpoch}
                      id="save-each-epoch"
                      onCheckedChange={setSaveEachEpoch}
                    />
                    <Label
                      className="cursor-pointer text-sm font-medium"
                      htmlFor="save-each-epoch"
                    >
                      Save Each Epoch
                    </Label>
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
