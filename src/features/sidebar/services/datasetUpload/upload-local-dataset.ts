import { client } from '@/lib/client';
import { getBackendErrorMessage } from '@/lib/error-utils';

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
    const { data } = await client.post<DatasetUploadResponse>(
      '/datasets',
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
    const errorMessage = getBackendErrorMessage(error);

    throw new Error(errorMessage);
  }
};
