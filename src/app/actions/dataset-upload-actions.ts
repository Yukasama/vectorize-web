import {
  revalidateDatasetsList,
  revalidateTasksList,
} from '@/app/actions/actions';
import { uploadHFDataset } from '@/features/sidebar/services/datasetUpload/huggingface-upload';
import { uploadLocalDataset } from '@/features/sidebar/services/datasetUpload/upload-local-dataset';
import {
  startSyntheticFromDataset,
  uploadMediaForSynthesis,
} from '@/features/sidebar/services/synthetic-service';

/**
 * Server Action: Upload Hugging Face dataset and revalidate lists (tasks at start, both at end).
 */
export const uploadHFDatasetWithRevalidate = async (
  datasetTag: string,
  revision?: string,
) => {
  'use server';
  await revalidateTasksList();
  await uploadHFDataset(datasetTag, revision);
  await revalidateDatasetsList();
  await revalidateTasksList();
};

/**
 * Server Action: Upload local dataset and revalidate lists (tasks at start, both at end).
 */
export const uploadLocalDatasetWithRevalidate = async (
  file: File,
  onProgress?: (percent: number) => void,
) => {
  'use server';
  await revalidateTasksList();
  await uploadLocalDataset(file, onProgress);
  await revalidateDatasetsList();
  await revalidateTasksList();
};

/**
 * Server Action: Upload media for synthetic data and revalidate lists (tasks at start, both at end).
 */
export const uploadMediaForSynthesisWithRevalidate = async (
  files: File[],
  existingDatasetId?: string,
) => {
  'use server';
  await revalidateTasksList();
  await uploadMediaForSynthesis(files, existingDatasetId);
  await revalidateDatasetsList();
  await revalidateTasksList();
};

/**
 * Server Action: Start synthetic generation from dataset and revalidate lists (tasks at start, both at end).
 */
export const startSyntheticFromDatasetWithRevalidate = async (
  datasetId: string,
) => {
  'use server';
  await revalidateTasksList();
  await startSyntheticFromDataset(datasetId);
  await revalidateDatasetsList();
  await revalidateTasksList();
};
