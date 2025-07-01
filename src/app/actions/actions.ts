'use server';

import { revalidateTag } from 'next/cache';

/**
 * Server Action to revalidate the models tag/server cache.
 * Call this after a mutation (e.g. delete, update, create) to ensure all users get fresh data.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateModelsList = async () => {
  revalidateTag('models');
};

/**
 * Server Action to revalidate the datasets tag/server cache.
 * Call this after a mutation (e.g. delete, update, create) to ensure all users get fresh data.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateDatasetsList = async () => {
  revalidateTag('datasets');
};

/**
 * Server Action to revalidate the tasks tag/server cache.
 * Call this after a mutation (e.g. create, update, delete) to ensure all users get fresh data.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateTasksList = async () => {
  revalidateTag('tasks');
};
