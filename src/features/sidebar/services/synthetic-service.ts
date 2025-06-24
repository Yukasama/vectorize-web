import { client } from '@/lib/client';
// --- Media Synthesis Endpoints ---

// Response from the /synthetic/media endpoint (media upload for synthesis)
export interface SyntheticMediaResponse {
  dataset_id?: string;
  file_count?: number;
  message: string;
  status_url: string;
  task_id: string;
}

// Response for synthetic task status and creation endpoints
export interface SyntheticTaskResponse {
  error_msg?: string;
  status: string;
  task_id: string;
}

/**
 * Upload media files (images, PDFs) for synthetic data generation.
 * Optionally links to an existing dataset.
 * @param files - Array of File objects to upload
 * @param existingDatasetId - Optional dataset ID to use
 * @returns SyntheticMediaResponse with task info
 */
export const uploadMediaForSynthesis = async (
  files: File[],
  existingDatasetId?: string,
): Promise<SyntheticMediaResponse> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  if (existingDatasetId) {
    formData.append('existing_dataset_id', existingDatasetId);
  }
  const { data } = await client.post<SyntheticMediaResponse>(
    '/synthesis/media',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

/**
 * List all synthesis tasks (optionally limited).
 * @param limit - Maximum number of tasks to return (default: 20)
 * @returns Array of SyntheticTaskResponse
 */
export const listSynthesisTasks = async (limit = 20) => {
  const { data } = await client.get<SyntheticTaskResponse[]>(
    `/synthesis/tasks?limit=${String(limit)}`,
  );
  return data;
};

/**
 * Start a synthetic data generation task from an existing dataset.
 * @param datasetId - The dataset ID to use for synthesis
 * @returns SyntheticTaskResponse with task info
 */
export const startSyntheticFromDataset = async (datasetId: string) => {
  const formData = new FormData();
  formData.append('existing_dataset_id', datasetId);
  const { data } = await client.post<SyntheticMediaResponse>(
    '/synthesis/media',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

/**
 * Get the status of a synthetic data generation task.
 * @param taskId - The task ID to check
 * @returns SyntheticTaskResponse with status and error info
 */
export const getSyntheticTaskStatus = async (taskId: string) => {
  const { data } = await client.get<SyntheticTaskResponse>(
    `/synthesis/tasks/${taskId}`,
  );
  return data;
};
