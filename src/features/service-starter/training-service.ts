import { client } from '@/lib/client';

/**
 * Provides API calls and types for starting and monitoring model training jobs.
 * Includes robust error handling for backend and validation errors.
 */

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
  val_dataset_id?: null | string;
  warmup_steps?: number;
  weight_decay?: number;
}

export interface TrainingStatusResponse {
  epoch?: number;
  error?: string;
  finished_at?: string;
  id: string;
  model_tag?: string;
  output_dir?: string;
  started_at?: string;
  status: string;
  train_loss?: number;
  train_runtime?: number;
  train_samples_per_second?: number;
  train_steps_per_second?: number;
  trained_model_id?: string;
  validation_dataset_path?: string;
}

export interface TrainingTaskResponse {
  created_at: string;
  end_date?: null | string;
  model_tag?: string;
  status: string;
  task_id: string;
  train_dataset_ids?: string[];
}

/**
 * Start a training job with the required and optional parameters.
 * Only sends required and filled optional fields.
 * Throws user-friendly errors for backend and validation issues.
 */
export const startTraining = async (
  params: StartTrainingParams,
): Promise<void> => {
  try {
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
    await client.post('/training/train', body);
  } catch (error) {
    const err = error as {
      message?: string;
      response?: {
        data?: {
          detail?: string;
          error?: string;
          message?: string;
        };
        status?: number;
      };
    };

    if (err.response) {
      const { data, status } = err.response;

      // Special handling for 422 validation errors
      if (status === 422) {
        throw new Error(
          'Invalid parameter input. Please check your training parameters and try again.',
        );
      }

      // For all other status codes, return the backend message
      const backendMessage =
        data?.message ?? data?.detail ?? data?.error ?? 'Server error';
      throw new Error(backendMessage);
    } else if (err.message) {
      throw new Error(err.message);
    }

    throw new Error('Unknown error occurred while starting training');
  }
};

/**
 * Fetch the status of a training job by its ID.
 */
export const fetchTrainingById = async (
  id: string,
): Promise<TrainingStatusResponse> => {
  const { data } = await client.get<TrainingStatusResponse>(
    `/training/${id}/status`,
  );
  return data;
};

/**
 * Fetch all fine-tune training tasks for a given model tag.
 */
export const fetchFineTuneTrainingTasks = async (
  modelTag: string,
): Promise<TrainingTaskResponse[]> => {
  const { data } = await client.get<TrainingTaskResponse[]>(
    `/training/fine-tunes/${modelTag}/tasks`,
  );
  return data;
};

/**
 * Fetch all fine-tune training tasks for a given model ID.
 */
export const fetchFineTuneTrainingTasksByModelId = async (
  modelId: string,
): Promise<TrainingTaskResponse[]> => {
  const { data } = await client.get<TrainingTaskResponse[]>(
    `/training/fine-tunes/${modelId}/tasks`,
  );
  return data;
};
