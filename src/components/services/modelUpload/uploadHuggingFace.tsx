import axios from 'axios';

export const uploadHuggingFace = async (modelId: string, tag: string) => {
  try {
    const { data } = await axios.post('http://localhost:8000/v1/uploads/load', {
      model_id: modelId,
      tag,
    });
    return data;
  } catch {
    throw new Error('Fehler beim Hochladen des Hugging Face-Modells');
  }
};
