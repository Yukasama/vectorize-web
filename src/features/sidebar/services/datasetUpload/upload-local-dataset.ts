import axios from 'axios';

interface DatasetUploadResponse {
  datasetId: string;
}

export const uploadLocalDataset = async (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<DatasetUploadResponse> => {
  const formData = new FormData();
  formData.append('files', file);

  try {
    const { data } = await axios.post<DatasetUploadResponse>(
      'http://localhost:8000/v1/datasets',
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
      console.error('Fehlerdetails:', error.response?.data ?? error.message);
    }
    throw new Error('Fehler beim Hochladen der Datei');
  }
};
