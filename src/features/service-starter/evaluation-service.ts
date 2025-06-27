import { client } from '@/lib/client';

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
