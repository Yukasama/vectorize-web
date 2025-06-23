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
  revision?: string,
): Promise<void> => {
  try {
    const payload: { dataset_tag: string; revision?: string } = {
      dataset_tag: datasetTag,
    };
    if (revision && revision.trim() !== '') {
      payload.revision = revision;
    }
    await axios.post('https://localhost/v1/datasets/huggingface', payload);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error(messages.dataset.upload.alreadyExists);
      }
      if (error.response?.status === 400) {
        throw new Error(messages.dataset.upload.error);
      }
      const data = error.response?.data as
        | undefined
        | { detail?: string; message?: string };
      const backendMessage =
        data?.detail ??
        data?.message ??
        messages.dataset.upload.errorFile(datasetTag);
      throw new Error(backendMessage);
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
      `https://localhost/v1/datasets/upload/huggingface/status/${taskId}`,
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
