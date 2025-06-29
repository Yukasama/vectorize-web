import {
  revalidateModelsList,
  revalidateTasksList,
} from '@/app/actions/actions';
import {
  startEvaluation,
  StartEvaluationParams,
} from '@/features/service-starter/evaluation-service';

/**
 * Server Action: Start evaluation, revalidate tasks list at start, and revalidate both models and tasks lists after completion for all users.
 */
export const startEvaluationWithRevalidate = async (
  params: StartEvaluationParams,
) => {
  'use server';
  await revalidateTasksList();
  await startEvaluation(params);
  await revalidateModelsList();
  await revalidateTasksList();
};
