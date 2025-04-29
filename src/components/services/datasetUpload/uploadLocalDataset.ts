import axios from 'axios';

export const uploadLocalDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await axios.post(
      'http://localhost:8000/v1/datasets',
      formData,
    );
    return data;
  } catch {
    throw new Error('Fehler beim Hochladen der Datei');
  }
};
