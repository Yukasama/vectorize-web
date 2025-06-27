import { client } from '@/lib/client';

export interface TrainingStatusResponse {
  error?: string;
  finished_at?: string;
  id: string;
  model_tag?: string;
  output_dir?: string;
  started_at?: string;
  status: string;
}

export const fetchTrainingById = async (
  id: string,
): Promise<TrainingStatusResponse | undefined> => {
  try {
    const { data } = await client.get<TrainingStatusResponse>(
      `/training/${id}/status`,
    );
    return data;
  } catch {
    return undefined;
  }
};
