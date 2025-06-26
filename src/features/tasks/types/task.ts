export interface Task {
  created_at: string;
  end_date: null | string;
  id: string;
  tag?: string;
  task_status: TaskStatus;
  task_type: TaskType;
}

export type TaskStatus = 'C' | 'D' | 'F' | 'Q' | 'R';

export type TaskType =
  | 'dataset_upload'
  | 'evaluation'
  | 'model_upload'
  | 'synthetis'
  | 'training';
