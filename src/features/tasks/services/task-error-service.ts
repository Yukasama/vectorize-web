import { client } from '@/lib/client';
import { Task } from '../types/task';

export interface TaskDetails extends Task {
  error_msg?: string;
  source?: string;
  updated_at?: string;
}

export interface TaskErrorDetails {
  error_msg?: string;
  status: string;
  task_id: string;
}

/**
 * Fetch complete task details including all metadata
 */
export const fetchTaskDetails = async (
  taskId: string,
): Promise<TaskDetails> => {
  try {
    // Try the general tasks endpoint first
    const { data } = await client.get<TaskDetails>(`/tasks/${taskId}`);
    return data;
  } catch {
    // Return a minimal fallback object
    return {
      created_at: new Date().toISOString(),
      // eslint-disable-next-line unicorn/no-null
      end_date: null,
      error_msg: 'Failed to load task details',
      id: taskId,
      task_status: 'F',
      task_type: 'training', // Default type
    };
  }
};

/**
 * Fetch detailed error information for a specific task from backend API
 */
export const fetchTaskErrorDetails = async (
  taskId: string,
  taskType: string,
): Promise<TaskErrorDetails> => {
  try {
    let endpoint = '';

    switch (taskType) {
      case 'dataset_upload': {
        endpoint = `/datasets/huggingface/status/${taskId}`;
        break;
      }
      case 'evaluation': {
        endpoint = `/evaluation/${taskId}/status`;
        break;
      }
      case 'model_upload': {
        endpoint = `/uploads/${taskId}`;
        break;
      }
      case 'synthesis': {
        endpoint = `/synthesis/tasks/${taskId}`;
        break;
      }
      case 'training': {
        endpoint = `/training/${taskId}/status`;
        break;
      }
      default: {
        try {
          const { data: tasksData } = await client.get<TaskErrorDetails[]>(
            `/tasks?status=F&limit=100`,
          );
          const foundTask = tasksData.find((task) => task.task_id === taskId);
          if (foundTask) {
            return foundTask;
          }
        } catch {
          // If unified endpoint fails, try generic task endpoint
        }
        endpoint = `/tasks/${taskId}`;
        break;
      }
    }

    const { data } = await client.get<TaskErrorDetails>(endpoint);
    return data;
  } catch {
    // Return a fallback object instead of undefined
    return {
      error_msg: undefined,
      status: 'F',
      task_id: taskId,
    };
  }
};
