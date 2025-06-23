import { messages } from '@/lib/messages';
import axios from 'axios';

interface DatasetUploadResponse {
  datasetId: string;
}

/**
 * Upload a local dataset file to the backend API.
 * Reports upload progress and throws an error if upload fails.
 */
export const uploadLocalDataset = async (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<DatasetUploadResponse> => {
  const formData = new FormData();
  formData.append('files', file);

  try {
    const { data } = await axios.post<DatasetUploadResponse>(
      'https://localhost/v1/datasets',
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            if (onProgress) {
              onProgress(percent);
            }
          }
        },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        messages.dataset.upload.errorFile(file.name),
        error.response?.data ?? error.message,
      );
    }
    throw new Error(messages.dataset.upload.errorFile(file.name));
  }
};
