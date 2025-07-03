import { client } from '@/lib/client';
import { getBackendErrorMessage } from '@/lib/error-utils';

export interface HFModelUploadResponse {
  taskId: string;
}

/**
 * Upload a model from Hugging Face by model tag and optional revision.
 * Returns the task ID for tracking the upload progress.
 */
export const uploadHuggingFace = async (
  modelTag: string,
  revision: string,
): Promise<HFModelUploadResponse> => {
  try {
    const payload: { model_tag: string; revision?: string } = {
      model_tag: modelTag,
    };
    if (revision && revision.trim() !== '') {
      payload.revision = revision;
    }
    const { data } = await client.post<HFModelUploadResponse>(
      '/uploads/huggingface',
      payload,
    );
    return data;
  } catch (error: unknown) {
    const errorMessage = getBackendErrorMessage(error);

    throw new Error(errorMessage);
  }
};
