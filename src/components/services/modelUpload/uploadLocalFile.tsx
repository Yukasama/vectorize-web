import axios from 'axios';

export const uploadLocalFile = async (
  files: File[], // Mehrere Dateien
  modelName: string,
  description = '',
  extractZip = true,
) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file); // Alle Dateien hinzufügen
  }

  try {
    const { data } = await axios.post(
      `http://localhost:8000/v1/uploads/models?model_name=${encodeURIComponent(
        modelName,
      )}&description=${encodeURIComponent(description)}&extract_zip=${extractZip}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  } catch (error: any) {
    console.error('Fehlerdetails:', error.response?.data || error.message);
    throw new Error('Fehler beim Hochladen der Datei');
  }
};
