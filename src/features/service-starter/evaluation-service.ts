import { client } from '@/lib/client';

export interface EvaluationStatusResponse {
  baseline_metrics?: null | Record<string, unknown>;
  baseline_model_tag?: null | string;
  created_at: string;
  dataset_info?: null | string;
  end_date?: null | string;
  error_msg?: null | string;
  evaluation_metrics?: null | Record<string, unknown>;
  evaluation_summary?: null | string;
  model_tag?: null | string;
  progress: number;
  status: string;
  task_id: string;
  updated_at: string;
}

export interface StartEvaluationParams {
  baseline_model_tag?: string;
  dataset_id?: string;
  max_samples?: number;
  model_tag: string;
  training_task_id?: string;
}

export const startEvaluation = async (
  params: StartEvaluationParams,
): Promise<void> => {
  const body: Record<string, unknown> = {
    model_tag: params.model_tag,
  };
  for (const key of [
    'baseline_model_tag',
    'dataset_id',
    'max_samples',
    'training_task_id',
  ]) {
    if (
      params[key as keyof StartEvaluationParams] !== undefined &&
      params[key as keyof StartEvaluationParams] !== ''
    ) {
      body[key] = params[key as keyof StartEvaluationParams];
    }
  }
  await client.post('/evaluation/evaluate', body);
};

/**
 * Get the status of an evaluation task by its task ID.
 * @param taskId - The evaluation task ID
 * @returns EvaluationStatusResponse with status and metrics
 */
export const fetchEvaluationStatus = async (
  taskId: string,
): Promise<EvaluationStatusResponse | undefined> => {
  try {
    const { data } = await client.get<EvaluationStatusResponse>(
      `/evaluation/${taskId}/status`,
    );
    return data;
  } catch {
    return undefined;
  }
};
