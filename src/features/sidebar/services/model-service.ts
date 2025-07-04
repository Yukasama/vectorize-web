import { client } from '@/lib/client';
import { getBackendErrorMessage } from '@/lib/error-utils';
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
    const errorMessage = getBackendErrorMessage(error);
    throw new Error(errorMessage);
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
      return { items: [], total: 0 };
    }

    const errorMessage = getBackendErrorMessage(error);
    throw new Error(errorMessage);
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
      return [];
    }

    const errorMessage = getBackendErrorMessage(error);
    throw new Error(errorMessage);
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

    const errorMessage = getBackendErrorMessage(error);
    throw new Error(errorMessage);
  }
};

/**
 * Fetch a single model by its ID or tag.
 */
export const fetchModelByIdOrTag = async (
  identifier: string,
): Promise<Model | undefined> => {
  try {
    const { data } = await client.get<Model>(`/models/${identifier}`);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 304) {
      return;
    }

    const errorMessage = getBackendErrorMessage(error);
    throw new Error(errorMessage);
  }
};

export const fetchModelById = fetchModelByIdOrTag;

/**
 * Update a model's name.
 */
export const updateModelName = async (
  id: string,
  name: string,
  version: number,
): Promise<void> => {
  try {
    const headers = { 'If-Match': `"${String(version)}"` };
    await client.put(`/models/${id}`, { name }, { headers: headers });
  } catch (error) {
    const errorMessage = getBackendErrorMessage(error);
    throw new Error(errorMessage);
  }
};
