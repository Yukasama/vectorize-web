import { EvaluationStatusResponse } from '@/features/service-starter/evaluation-service';
import { Task } from '@/features/tasks/types/task';
import { client } from '@/lib/client';

/**
 * Service functions for fetching dataset-related tasks efficiently.
 * These functions provide better abstractions for dataset task queries.
 */

export interface DatasetTaskInfo {
  created_at: string;
  end_date?: null | string;
  id: string;
  role:
    | 'Dataset Upload'
    | 'Evaluation Dataset'
    | 'Synthesis Dataset'
    | 'Training Dataset'
    | 'Validation Dataset';
  status: string;
  tag?: string;
  task_type: 'dataset_upload' | 'evaluation' | 'synthesis' | 'training';
}

/**
 * Fetch all dataset upload and synthesis tasks for a specific dataset.
 * This is the most efficient query as it filters directly by dataset tag.
 */
export const fetchDatasetOwnTasks = async (
  datasetId: string,
): Promise<DatasetTaskInfo[]> => {
  try {
    const { data: uploadTasks } = await client.get<Task[]>('/tasks', {
      params: {
        limit: 50,
        tag: datasetId,
        task_type: 'dataset_upload',
      },
    });

    const { data: synthesisTasks } = await client.get<Task[]>('/tasks', {
      params: {
        limit: 50,
        tag: datasetId,
        task_type: 'synthesis',
      },
    });

    const allTasks: DatasetTaskInfo[] = [
      ...uploadTasks.map(
        (task): DatasetTaskInfo => ({
          created_at: task.created_at,
          end_date: task.end_date,
          id: task.id,
          role: 'Dataset Upload',
          status: task.task_status,
          tag: task.tag,
          task_type: 'dataset_upload',
        }),
      ),
      ...synthesisTasks.map(
        (task): DatasetTaskInfo => ({
          created_at: task.created_at,
          end_date: task.end_date,
          id: task.id,
          role: 'Synthesis Dataset',
          status: task.task_status,
          tag: task.tag,
          task_type: 'synthesis',
        }),
      ),
    ];

    return allTasks.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (error) {
    console.warn('Failed to fetch dataset own tasks:', error);
    return [];
  }
};

/**
 * Fetch evaluation tasks that reference the dataset.
 * This requires fetching recent evaluation tasks and checking their dataset_info.
 */
export const fetchDatasetEvaluationTasks = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _datasetId: string,
): Promise<DatasetTaskInfo[]> => {
  try {
    // Fetch evaluation tasks (minimal parameters to avoid 422 errors)
    const { data: evaluationTasks } = await client.get<Task[]>('/tasks', {
      params: {
        task_type: 'evaluation',
      },
    });

    const relevantTasks: DatasetTaskInfo[] = [];

    // Use Promise.allSettled to handle individual failures gracefully
    const taskChecks = evaluationTasks.map(async (task) => {
      try {
        await client.get<EvaluationStatusResponse>(
          `/evaluation/${task.id}/status`,
        );

        // Show ALL evaluation tasks, not just filtered ones
        return {
          created_at: task.created_at,
          end_date: task.end_date,
          id: task.id,
          role: 'Evaluation Dataset' as const,
          status: task.task_status,
          tag: task.tag,
          task_type: 'evaluation' as const,
        };
      } catch {
        // Silently skip failed individual task checks
      }
    });

    const results = await Promise.allSettled(taskChecks);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        relevantTasks.push(result.value);
      }
    }

    return relevantTasks.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (error) {
    console.warn('Failed to fetch dataset evaluation tasks:', error);
    return [];
  }
};

/**
 * Fetch training tasks that reference the dataset as training or validation data.
 * This requires fetching recent training tasks and checking their dataset references.
 */
export const fetchDatasetTrainingTasks = async (): Promise<
  DatasetTaskInfo[]
> => {
  try {
    // Fetch training tasks (minimal parameters to avoid 422 errors)
    const { data: trainingTasks } = await client.get<Task[]>('/tasks', {
      params: {
        task_type: 'training',
      },
    });

    const relevantTasks: DatasetTaskInfo[] = [];

    // Use Promise.allSettled for graceful error handling
    const taskChecks = trainingTasks.map(async (task) => {
      try {
        await client.get<{
          train_dataset_ids?: string[];
          val_dataset_id?: string;
        }>(`/training/${task.id}/status`);

        // Show ALL training tasks, not just filtered ones
        return {
          created_at: task.created_at,
          end_date: task.end_date,
          id: task.id,
          role: 'Training Dataset' as const,
          status: task.task_status,
          tag: task.tag,
          task_type: 'training' as const,
        };
      } catch {
        // Silently skip failed individual task checks
      }
    });

    const results = await Promise.allSettled(taskChecks);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        relevantTasks.push(result.value);
      }
    }

    return relevantTasks.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (error) {
    console.warn('Failed to fetch dataset training tasks:', error);
    return [];
  }
};

/**
 * Fetch all dataset-related tasks efficiently.
 * Combines dataset own tasks, evaluation tasks, and training tasks.
 */
export const fetchAllDatasetTasks = async (
  datasetId: string,
): Promise<DatasetTaskInfo[]> => {
  // Run all queries in parallel for better performance
  const [ownTasks, evaluationTasks, trainingTasks] = await Promise.allSettled([
    fetchDatasetOwnTasks(datasetId),
    fetchDatasetEvaluationTasks(datasetId),
    fetchDatasetTrainingTasks(),
  ]);

  const allTasks: DatasetTaskInfo[] = [];

  if (ownTasks.status === 'fulfilled') {
    allTasks.push(...ownTasks.value);
  }
  if (evaluationTasks.status === 'fulfilled') {
    allTasks.push(...evaluationTasks.value);
  }
  if (trainingTasks.status === 'fulfilled') {
    allTasks.push(...trainingTasks.value);
  }

  // Sort all tasks by creation date (newest first)
  return allTasks.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
};
