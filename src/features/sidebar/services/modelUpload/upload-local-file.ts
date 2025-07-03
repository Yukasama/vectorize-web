import { client } from '@/lib/client';
import { getBackendErrorMessage } from '@/lib/error-utils';
import { messages } from '@/lib/messages';

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
    const errorMessage = getBackendErrorMessage(error);

    throw new Error(errorMessage);
  }
};
