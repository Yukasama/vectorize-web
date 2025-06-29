'use server';

import {
  revalidateModelsList,
  revalidateTasksList,
} from '@/app/actions/actions';
import {
  startTraining,
  StartTrainingParams,
} from '@/features/service-starter/training-service';

/**
 * Server Action: Start training, revalidate tasks list at start, and revalidate both models and tasks lists after completion for all users.
 */
export const startTrainingWithRevalidate = async (
  params: StartTrainingParams,
) => {
  await startTraining(params);
  await revalidateModelsList();
  await revalidateTasksList();
};
