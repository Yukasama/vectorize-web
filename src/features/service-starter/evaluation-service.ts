import axios from 'axios';

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
  if (params.dataset_id) {
    body.dataset_id = params.dataset_id;
  }
  if (params.max_samples) {
    body.max_samples = params.max_samples;
  }
  if (params.baseline_model_tag) {
    body.baseline_model_tag = params.baseline_model_tag;
  }
  if (params.training_task_id) {
    body.training_task_id = params.training_task_id;
  }

  await axios.post('http://localhost:8000/v1/evaluation/evaluate', body);
};
