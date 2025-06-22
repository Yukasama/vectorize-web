import { revalidatePath } from 'next/cache';

/**
 * Server Action to revalidate the models list page/server cache.
 * Call this after a mutation (e.g. delete, update, create) to ensure all users get fresh data.
 */
export const revalidateModelsList = () => {
  'use server';
  revalidatePath('/model');
};

/**
 * Server Action to revalidate the datasets list page/server cache.
 * Call this after a mutation (e.g. delete, update, create) to ensure all users get fresh data.
 */
export const revalidateDatasetsList = () => {
  'use server';
  revalidatePath('/dataset');
};
