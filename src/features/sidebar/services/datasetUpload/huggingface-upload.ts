import { client } from '@/lib/client';
import { getBackendErrorMessage } from '@/lib/error-utils';

export interface HFUploadResponse {
  taskId: string;
}

export interface UploadDatasetTask {
  dataset_tag: string;
  error?: string;
  id: string;
  status: string;
}

/**
 * Upload a Hugging Face dataset by tag to the backend API.
 * Throws an error if upload fails.
 */
export const uploadHFDataset = async (
  datasetTag: string,
  revision?: string,
): Promise<void> => {
  try {
    const payload: { dataset_tag: string; revision?: string } = {
      dataset_tag: datasetTag,
    };
    if (revision && revision.trim() !== '') {
      payload.revision = revision;
    }
    await client.post('/datasets/huggingface', payload);
  } catch (error: unknown) {
    const errorMessage = getBackendErrorMessage(error);

    throw new Error(errorMessage);
  }
};

/**
 * Get the status of a Hugging Face dataset upload task.
 */
export const getHFUploadStatus = async (
  taskId: string,
): Promise<UploadDatasetTask> => {
  try {
    const { data } = await client.get<UploadDatasetTask>(
      `/datasets/huggingface/status/${taskId}`,
    );
    return data;
  } catch (error: unknown) {
    const errorMessage = getBackendErrorMessage(error);

    throw new Error(errorMessage);
  }
};
