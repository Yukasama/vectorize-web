import axios from 'axios';

interface DatasetUploadResponse {
  datasetId: string;
}

export const uploadLocalDataset = async (
  file: File,
): Promise<DatasetUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await axios.post<DatasetUploadResponse>(
      'http://localhost:8000/v1/datasets',
      formData,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Fehlerdetails:', error.response?.data ?? error.message);
    }
    throw new Error('Fehler beim Hochladen der Datei');
  }
};
