import axios from 'axios';

interface HuggingFaceUploadResponse {
  message: string;
  modelId: string;
  tag?: string;
}

export const uploadHuggingFace = async (
  modelId: string,
  tag: string,
): Promise<HuggingFaceUploadResponse> => {
  try {
    const { data } = await axios.post<HuggingFaceUploadResponse>(
      'http://localhost:8000/v1/uploads/load',
      {
        model_id: modelId,
        tag,
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Fehlerdetails:', error.response?.data ?? error.message);
    }
    throw new Error('Fehler beim Hochladen des Hugging Face-Modells');
  }
};
