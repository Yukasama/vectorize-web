import { messages } from '@/lib/messages';
import axios from 'axios';

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

export interface Dataset {
  classification?: string;
  created_at?: string;
  file_name?: string;
  id: string;
  name: string;
  rows?: number;
  version?: number;
}

/**
 * Update (rename) a dataset by its ID.
 */
export const updateDataset = async (
  id: string,
  name: string,
  version: number,
): Promise<void> => {
  await axios.put(
    `https://localhost/v1/datasets/${id}`,
    { name },
    { headers: { 'If-Match': `"${String(version)}"` } },
  );
};

/**
 * Fetch all datasets from the backend API.
 */
export const fetchDatasets = async (): Promise<Dataset[]> => {
  try {
    const response = await axios.get<Dataset[]>(
      'https://localhost/v1/datasets',
    );
    return response.data.items;
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
    const response = await axios.get<Dataset>(
      `https://localhost/v1/datasets/${id}`,
    );
    return response.data;
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
    await axios.delete(`https://localhost/v1/datasets/${id}`);
    return true;
  } catch (error) {
    console.error(messages.dataset.delete.error, error);
    return false;
  }
};
