import { messages } from '@/lib/messages';
import axios from 'axios';

export interface Model {
  created_at: string;
  id: string;
  model_tag: string;
  name: string;
  source: string;
  updated_at: string;
  version: number;
}

interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalpages: number;
}

/**
 * Delete a model by its ID.
 */
export const deleteModel = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`https://localhost/v1/models/${id}`);
    return true;
  } catch (error) {
    console.error(messages.model.delete.error, error);
    return false;
  }
};

/**
 * Fetch multiple models
 */
export const fetchModels = async (): Promise<Model[]> => {
  try {
    const response = await axios.get<PagedResponse<Model>>(
      'https://localhost/v1/models?page=1&size=100',
    );
    return response.data.items;
  } catch (error) {
    console.error('Fehler beim Abrufen der Modelle:', error);
    return [];
  }
};

/**
 * Fetch a single model by its tag.
 */
export const fetchModelById = async (
  model_tag: string,
): Promise<Model | undefined> => {
  try {
    const response = await axios.get<Model>(
      `https://localhost/v1/models/${model_tag}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 304) {
      return undefined;
    }
    console.error('Error fetching model:', error);
    return undefined;
  }
};

/**
 * Update a model's name.
 */
export const updateModelName = async (
  id: string,
  name: string,
  version: number,
): Promise<void> => {
  await axios.put(
    `https://localhost/v1/models/${id}`,
    { name },
    {
      headers: {
        'If-Match': `"${String(version)}"`,
      },
    },
  );
};
