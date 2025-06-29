import { revalidatePath } from 'next/cache';

/**
 * Server Action to revalidate the models list page/server cache.
 * Call this after a mutation (e.g. delete, update, create) to ensure all users get fresh data.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateModelsList = async () => {
  'use server';
  revalidatePath('/model');
};

/**
 * Server Action to revalidate the datasets list page/server cache.
 * Call this after a mutation (e.g. delete, update, create) to ensure all users get fresh data.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateDatasetsList = async () => {
  'use server';
  revalidatePath('/dataset');
};

/**
 * Server Action to revalidate the tasks list page/server cache.
 * Call this after a mutation (e.g. create, update, delete) to ensure all users get fresh data.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateTasksList = async () => {
  'use server';
  revalidatePath('/tasks');
};
