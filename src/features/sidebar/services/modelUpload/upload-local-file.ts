import axios from 'axios';

interface LocalFileUploadResponse {
  file_count: number;
  model_dir: string;
  model_id: string;
  model_name: string;
}

export const uploadLocalFile = async (
  files: File[],
  extractZip = true,
): Promise<{ message: string; modelId: string }> => {
  if (files.length === 0) {
    throw new Error('Keine Datei ausgewählt');
  }

  const modelName = files[0].name.replace(/\.[^/.]+$/, '') || 'uploaded-model';

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  try {
    const { data } = await axios.post<LocalFileUploadResponse>(
      `http://localhost:8000/v1/uploads/models?model_name=${encodeURIComponent(
        modelName,
      )}&extract_zip=${extractZip.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return {
      message: `Model '${data.model_name}' erfolgreich hochgeladen.`,
      modelId: data.model_id,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Fehlerdetails:', error.response?.data ?? error.message);
      throw new Error('Fehler beim Hochladen der Datei');
    }
    throw error;
  }
};
