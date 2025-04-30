import axios from 'axios';

interface LocalFileUploadResponse {
  message: string;
  modelId: string;
}

export const uploadLocalFile = async (
  files: File[],
  modelName: string,
  description = '',
  extractZip = true,
): Promise<LocalFileUploadResponse> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  formData.append('model_name', modelName);

  try {
    const { data } = await axios.post<LocalFileUploadResponse>(
      `http://localhost:8000/v1/uploads/models?model_name=${encodeURIComponent(
        modelName,
      )}&description=${encodeURIComponent(description)}&extract_zip=${extractZip.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Fehlerdetails:', error.response?.data ?? error.message);
      throw new Error('Fehler beim Hochladen der Datei');
    }
    throw error;
  }
};
