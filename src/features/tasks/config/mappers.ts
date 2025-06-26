import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import { TaskStatus, TaskType } from '../types/task';

export const TASKS_STATUS_MAP: Record<
  TaskStatus,
  {
    animate?: boolean;
    badgeColor: string;
    color: string;
    description: string;
    Icon: typeof CheckCircle;
    label: string;
  }
> = {
  C: {
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
    color: 'text-gray-600',
    description: 'Task was cancelled',
    Icon: AlertCircle,
    label: 'Cancelled',
  },
  D: {
    badgeColor: 'bg-green-100 text-green-700 border-green-300',
    color: 'text-green-600',
    description: 'Task completed successfully',
    Icon: CheckCircle,
    label: 'Completed',
  },
  F: {
    badgeColor: 'bg-red-100 text-red-700 border-red-300',
    color: 'text-red-600',
    description: 'Task failed to complete',
    Icon: XCircle,
    label: 'Failed',
  },
  Q: {
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
    color: 'text-amber-600',
    description: 'Task is waiting to be processed',
    Icon: Clock,
    label: 'Queued',
  },
  R: {
    animate: true,
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
    color: 'text-blue-600',
    description: 'Task is currently running',
    Icon: Loader2,
    label: 'Running',
  },
};

export const TASKS_TYPE_MAP: Record<TaskType, string> = {
  dataset_upload: 'Dataset Upload',
  evaluation: 'Evaluation',
  model_upload: 'Model Upload',
  synthetis: 'Synthesis',
  training: 'Training',
};
