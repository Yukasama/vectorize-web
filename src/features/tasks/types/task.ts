export interface Task {
  created_at: string;
  end_date: null | string;
  id: string;
  model_id?: string;
  tag?: string;
  task_status: TaskStatus;
  task_type: TaskType;
}
export interface TaskResponse {
  items: Task[];
  limit: number;
  offset: number;
  total: number;
}

export type TaskStatus = 'D' | 'F' | 'Q' | 'R';

export type TaskType =
  | 'dataset_upload'
  | 'evaluation'
  | 'model_upload'
  | 'synthesis'
  | 'training';
