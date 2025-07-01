'use server';

import {
  deleteDataset,
  updateDataset,
} from '@/features/sidebar/services/dataset-service';
import { revalidateTag } from 'next/cache';

/**
 * Server Action: Rename dataset and revalidate lists.
 */
export const updateDatasetWithRevalidate = async (
  datasetId: string,
  newName: string,
  version: number,
) => {
  await updateDataset(datasetId, newName, version);
  revalidateTag('datasets');
};

/**
 * Server Action: Delete dataset and revalidate lists.
 */
export const deleteDatasetWithRevalidate = async (datasetId: string) => {
  await deleteDataset(datasetId);
  revalidateTag('datasets');
};
