import axios from 'axios';

/**
 * Parameters for starting a training job.
 */
export interface StartTrainingParams {
  dataloader_num_workers?: number;
  device?: string;
  epochs?: number;
  evaluation_steps?: number;
  learning_rate?: number;
  max_grad_norm?: number;
  model_tag: string;
  optimizer_name?: string;
  output_path?: string;
  per_device_train_batch_size?: number;
  save_best_model?: boolean;
  save_each_epoch?: boolean;
  save_optimizer_state?: boolean;
  scheduler?: string;
  show_progress_bar?: boolean;
  timeout_seconds?: number;
  train_dataset_ids: string[];
  use_amp?: boolean;
  warmup_steps?: number;
  weight_decay?: number;
}

/**
 * Start a training job with the required and optional parameters.
 * Only sends required and filled optional fields.
 */
export const startTraining = async (
  params: StartTrainingParams,
): Promise<void> => {
  const body: Record<string, unknown> = {
    model_tag: params.model_tag,
    train_dataset_ids: params.train_dataset_ids,
  };
  for (const key of [
    'epochs',
    'per_device_train_batch_size',
    'learning_rate',
    'warmup_steps',
    'optimizer_name',
    'scheduler',
    'weight_decay',
    'max_grad_norm',
    'use_amp',
    'show_progress_bar',
    'evaluation_steps',
    'output_path',
    'save_best_model',
    'save_each_epoch',
    'save_optimizer_state',
    'dataloader_num_workers',
    'device',
    'timeout_seconds',
  ]) {
    if (
      params[key as keyof StartTrainingParams] !== undefined &&
      params[key as keyof StartTrainingParams] !== ''
    ) {
      body[key] = params[key as keyof StartTrainingParams];
    }
  }
  await axios.post('http://localhost:8000/v1/training/train', body);
};
