import { client } from '@/lib/client';
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
  total: number;
  totalpages: number;
}

/**
 * Delete a model by its ID.
 */
export const deleteModel = async (id: string): Promise<boolean> => {
  try {
    await client.delete(`/models/${id}`);
    return true;
  } catch (error) {
    console.error(messages.model.delete.error, error);
    return false;
  }
};

/**
 * Fetch models with pagination support.
 */
export const fetchModels = async (
  page = 1,
  size = 100,
): Promise<{ items: Model[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('page', page.toString());
    queryParams.set('size', size.toString());

    const { data } = await client.get<PagedResponse<Model>>(
      `/models?${queryParams.toString()}`,
    );
    return { items: data.items, total: data.total };
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
      console.warn('Backend not reachable - returning empty models list');
    } else {
      console.error('Error fetching models:', error);
    }
    return { items: [], total: 0 };
  }
};

/**
 * Fetch all models (for components that need the complete list).
 */
export const fetchAllModels = async (): Promise<Model[]> => {
  try {
    // First, get the total count
    const { data: firstPage } = await client.get<PagedResponse<Model>>(
      '/models?page=1&size=100',
    );
    const totalCount = firstPage.total;
    const totalPages = firstPage.totalpages;

    // If we have all models in the first request, return them
    if (firstPage.items.length >= totalCount || totalPages <= 1) {
      return firstPage.items;
    }

    // Otherwise, fetch all models by making multiple requests
    const allModels: Model[] = [...firstPage.items];

    for (let page = 2; page <= totalPages; page++) {
      const { data: batch } = await client.get<PagedResponse<Model>>(
        `/models?page=${page}&size=100`,
      );
      allModels.push(...batch.items);
    }

    return allModels;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
      console.warn('Backend not reachable - returning empty models list');
    } else {
      console.error('Error fetching all models:', error);
    }
    return [];
  }
};

/**
 * Fetch a single model by its tag.
 */
export const fetchModelByTag = async (
  model_tag: string,
): Promise<Model | undefined> => {
  try {
    const { data } = await client.get<Model>(`/models/${model_tag}`);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 304) {
      return;
    }
    console.error('Error fetching model:', error);
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
  const headers = { 'If-Match': `"${String(version)}"` };
  await client.put(`/models/${id}`, { name }, { headers: headers });
};
