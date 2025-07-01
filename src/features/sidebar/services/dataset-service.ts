import { client } from '@/lib/client';
import { messages } from '@/lib/messages';
import { isAxiosError } from 'axios';

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
  try {
    const headers = {
      'Content-Type': 'application/json',
      'If-Match': `"${String(version)}"`,
    };
    await client.put(`/datasets/${id}`, { name }, { headers });
  } catch (error) {
    console.error('Error updating dataset:', error);
    throw error;
  }
};

/**
 * Fetch datasets with pagination support.
 */
export const fetchDatasets = async (
  limit?: number,
  offset?: number,
): Promise<{ items: Dataset[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    if (limit !== undefined) {
      queryParams.set('limit', limit.toString());
    }
    if (offset !== undefined) {
      queryParams.set('offset', offset.toString());
    }

    const { data } = await client.get<DatasetResponse>(
      `/datasets?${queryParams.toString()}`,
    );
    return { items: data.items, total: data.total };
  } catch (error) {
    if (
      isAxiosError(error) &&
      (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED')
    ) {
      console.warn('Backend not reachable - returning empty datasets list');
    } else {
      console.error(messages.dataset.general.unknownError, error);
    }
    return { items: [], total: 0 };
  }
};

/**
 * Fetch all datasets (for components that need the complete list).
 */
export const fetchAllDatasets = async (): Promise<Dataset[]> => {
  try {
    // First, get the total count
    const { data: firstPage } = await client.get<DatasetResponse>(
      '/datasets?limit=100&offset=0',
    );
    const totalCount = firstPage.total;

    // If we have all datasets in the first request, return them
    if (firstPage.items.length >= totalCount) {
      return firstPage.items;
    }

    // Otherwise, fetch all datasets by making multiple requests
    const allDatasets: Dataset[] = [...firstPage.items];
    const batchSize = 100;

    for (let offset = batchSize; offset < totalCount; offset += batchSize) {
      const { data: batch } = await client.get<DatasetResponse>(
        `/datasets?limit=${batchSize}&offset=${offset}`,
      );
      allDatasets.push(...batch.items);
    }

    return allDatasets;
  } catch (error) {
    if (
      isAxiosError(error) &&
      (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED')
    ) {
      console.warn('Backend not reachable - returning empty datasets list');
    } else {
      console.error(messages.dataset.general.unknownError, error);
    }
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
