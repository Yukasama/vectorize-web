import { client } from '@/lib/client';
import { messages } from '@/lib/messages';
import { isAxiosError } from 'axios';

/**
 * Upload a model from Hugging Face by model tag and optional revision.
 */
export const uploadHuggingFace = async (
  modelTag: string,
  revision: string,
): Promise<void> => {
  try {
    const payload: { model_tag: string; revision?: string } = {
      model_tag: modelTag,
    };
    if (revision && revision.trim() !== '') {
      payload.revision = revision;
    }
    await client.post('/uploads/huggingface', payload);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error(messages.model.upload.alreadyExists);
      }
      if (error.response?.status === 400) {
        throw new Error(messages.model.upload.huggingfaceError);
      }
      const data = error.response?.data as
        | undefined
        | { detail?: string; message?: string };
      const backendMessage =
        data?.detail ?? data?.message ?? messages.model.upload.huggingfaceError;
      throw new Error(backendMessage);
    }
    throw new Error(messages.model.upload.huggingfaceError);
  }
};
