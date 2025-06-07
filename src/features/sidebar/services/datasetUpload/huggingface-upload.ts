import { messages } from '@/lib/messages';
import axios from 'axios';

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
): Promise<HFUploadResponse> => {
  try {
    const { data } = await axios.post<HFUploadResponse>(
      'http://localhost:8000/v1/datasets/upload/huggingface',
      { dataset_tag: datasetTag },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        messages.dataset.upload.errorFile(datasetTag),
        error.response?.data ?? error.message,
      );
    }
    throw new Error(messages.dataset.upload.errorFile(datasetTag));
  }
};

/**
 * Get the status of a Hugging Face dataset upload task.
 */
export const getHFUploadStatus = async (
  taskId: string,
): Promise<UploadDatasetTask> => {
  try {
    const { data } = await axios.get<UploadDatasetTask>(
      `http://localhost:8000/v1/datasets/upload/huggingface/status/${taskId}`,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        messages.dataset.upload.errorFile(taskId),
        error.response?.data ?? error.message,
      );
    }
    throw new Error(messages.dataset.upload.errorFile(taskId));
  }
};
