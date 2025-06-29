import { client } from '@/lib/client';
import { messages } from '@/lib/messages';
import { isAxiosError } from 'axios';

/**
 * Upload a local model file (ZIP) to the backend API.
 */
export const uploadLocalFile = async (
  file: File,
  modelName?: string,
): Promise<{
  message: string;
  models: { directory: string; id: string; name: string; url: string }[];
}> => {
  if (!file.name.toLowerCase().endsWith('.zip')) {
    throw new Error(messages.model.upload.onlyZip);
  }

  const formData = new FormData();
  formData.append('file', file);

  let url = '/uploads/local';
  if (modelName) {
    url += '?model_name=' + encodeURIComponent(modelName);
  }

  try {
    const { data } = await client.post<{
      message: string;
      models: { directory: string; id: string; name: string; url: string }[];
    }>(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error(messages.model.upload.onlyZip);
      }
      if (error.response?.status === 409) {
        throw new Error(messages.model.upload.alreadyExists);
      }
      // Use backend error message if available, otherwise fallback to messages
      const data = error.response?.data as
        | undefined
        | { detail?: string; message?: string };
      const backendMessage =
        data?.detail ?? data?.message ?? messages.model.upload.error;
      throw new Error(backendMessage);
    }
    throw new Error(messages.model.upload.error);
  }
};
