import { client } from '@/lib/client';
import { messages } from '@/lib/messages';

/**
 * Service functions for fetching and deleting datasets from the backend API.
 */

export interface Dataset {
  classification?: string;
  created_at?: string;
  file_name?: string;
  id: string;
  name: string;
  rows?: number;
  version?: number;
}

export interface DatasetResponse {
  items: Dataset[];
  limit: number;
  offset: number;
  total: number;
}

/**
 * Update (rename) a dataset by its ID.
 */
export const updateDataset = async (
  id: string,
  name: string,
  version: number,
): Promise<void> => {
  const headers = { 'If-Match': `"${String(version)}"` };
  await client.put(`/datasets/${id}`, { name }, { headers: headers });
};

/**
 * Fetch all datasets from the backend API.
 */
export const fetchDatasets = async (): Promise<Dataset[]> => {
  try {
    const { data } = await client.get<DatasetResponse>('/datasets');
    return data.items;
  } catch (error) {
    console.error(messages.dataset.general.unknownError, error);
    return [];
  }
};

/**
 * Fetch a single dataset by its ID.
 */
export const fetchDatasetById = async (
  id: string,
): Promise<Dataset | undefined> => {
  try {
    const { data } = await client.get<Dataset>(`/datasets/${id}`);
    return data;
  } catch (error) {
    console.error(messages.dataset.general.unknownError, error);
    return undefined;
  }
};

/**
 * Delete a dataset by its ID.
 */
export const deleteDataset = async (id: string): Promise<boolean> => {
  try {
    await client.delete(`/datasets/${id}`);
    return true;
  } catch (error) {
    console.error(messages.dataset.delete.error, error);
    return false;
  }
};
