import {
  revalidateModelsList,
  revalidateTasksList,
} from '@/app/actions/actions';
import { uploadGithub } from '@/features/sidebar/services/modelUpload/upload-github';
import { uploadHuggingFace } from '@/features/sidebar/services/modelUpload/upload-huggingface';
import { uploadLocalFile } from '@/features/sidebar/services/modelUpload/upload-local-file';

/**
 * Server Action: Upload model from Hugging Face, revalidate tasks and models lists for all users.
 */
export const uploadHuggingFaceWithRevalidate = async (
  modelTag: string,
  revision: string,
) => {
  'use server';
  await revalidateTasksList();
  await uploadHuggingFace(modelTag, revision);
  await revalidateModelsList();
  await revalidateTasksList();
};

/**
 * Server Action: Upload model from GitHub, revalidate tasks and models lists for all users.
 */
export const uploadGithubWithRevalidate = async (
  owner: string,
  repo: string,
  revision?: string,
) => {
  'use server';
  await revalidateTasksList();
  await uploadGithub(owner, repo, revision);
  await revalidateModelsList();
  await revalidateTasksList();
};

/**
 * Server Action: Upload local model file and revalidate models and tasks lists for all users.
 */
export const uploadLocalFileWithRevalidate = async (
  file: File,
  modelName?: string,
) => {
  'use server';
  await uploadLocalFile(file, modelName);
  await revalidateModelsList();
  await revalidateTasksList();
};
