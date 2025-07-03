import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EvaluationStatusResponse } from '@/features/service-starter/evaluation-service';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import { TaskErrorHoverCard } from '@/features/tasks/task-error-hover-card';
import { Task, TaskStatus, TaskType } from '@/features/tasks/types/task';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

export const TASKS_TYPE_MAP: Record<TaskType, string> = {
  dataset_upload: 'Dataset Upload',
  evaluation: 'Evaluation',
  model_upload: 'Model Upload',
  synthesis: 'Synthesis',
  training: 'Training',
};

const getRoleDisplay = (task: TaskWithRole): string => {
  if (task.task_type === 'training') {
    return 'Base Model';
  }
  if (task.task_type === 'evaluation' && task.evaluationRole) {
    return task.evaluationRole === 'main' ? 'Main Model' : 'Baseline Model';
  }
  return '-';
};

interface ModelTaskListProps {
  modelTag: string;
}

// Extended task type to include role information for evaluations
interface TaskWithRole extends Task {
  evaluationRole?: 'baseline' | 'main';
}

interface TrainingStatusResponse {
  created_at: string;
  end_date: null | string;
  status: TaskStatus;
  task_id: string;
}

export const ModelTaskList = ({ modelTag }: ModelTaskListProps) => {
  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    enabled: !!modelTag,
    queryFn: async (): Promise<TaskWithRole[]> => {
      // Always try to get training tasks first (most reliable)
      let trainingTasks: TrainingStatusResponse[] = [];
      let mainEvaluationTasks: Task[] = [];

      try {
        // Use the new specific endpoint for training tasks from a base model
        const { data } = await client.get<TrainingStatusResponse[]>(
          `/training/fine-tunes/${modelTag}/tasks`,
        );
        trainingTasks = data;
      } catch {
        // Silently continue without training tasks if endpoint fails
      }

      try {
        // Get evaluation tasks where this model is the main model (using tag filter)
        const { data } = await client.get<Task[]>('/tasks', {
          params: {
            tag: modelTag,
            task_type: 'evaluation',
            within_hours: 24 * 30,
          },
        });
        mainEvaluationTasks = data;
      } catch {
        // Silently continue without main evaluation tasks if endpoint fails
      }

      // Also get evaluation tasks where this model might be used as baseline
      // Since tasks API doesn't filter by baseline_model_tag, we need to fetch all evaluations
      // and check their details individually
      let allEvaluationTasks: Task[] = [];
      try {
        const { data } = await client.get<Task[]>('/tasks', {
          params: {
            task_type: 'evaluation',
            within_hours: 24 * 30, // Get tasks from last 30 days
          },
        });
        allEvaluationTasks = data;
      } catch {
        // Continue with empty array if this fails
        allEvaluationTasks = [];
      }

      // Check which evaluations use this model as baseline
      const baselineEvaluationTasks: Task[] = [];
      for (const task of allEvaluationTasks) {
        // Skip if this is already in main evaluation tasks
        if (mainEvaluationTasks.some((mainTask) => mainTask.id === task.id)) {
          continue;
        }

        try {
          // Fetch evaluation details to check if it uses this model as baseline
          const { data: evalDetails } =
            await client.get<EvaluationStatusResponse>(
              `/evaluation/${task.id}/status`,
            );

          if (evalDetails.baseline_model_tag === modelTag) {
            baselineEvaluationTasks.push(task);
          }
        } catch {
          // Skip this evaluation if we can't fetch its details
        }
      }

      // Combine all evaluation tasks with role information
      const evaluationTasks: TaskWithRole[] = [
        ...mainEvaluationTasks.map(
          (task): TaskWithRole => ({
            ...task,
            evaluationRole: 'main' as const,
          }),
        ),
        ...baselineEvaluationTasks.map(
          (task): TaskWithRole => ({
            ...task,
            evaluationRole: 'baseline' as const,
          }),
        ),
      ];

      // Convert training task responses to Task format and combine with evaluations
      const allTasks: TaskWithRole[] = [
        ...trainingTasks.map(
          (trainingTask): TaskWithRole => ({
            created_at: trainingTask.created_at,
            end_date: trainingTask.end_date,
            id: trainingTask.task_id,
            tag: modelTag, // Add the model tag for consistency
            task_status: trainingTask.status,
            task_type: 'training' as TaskType,
          }),
        ),
        ...evaluationTasks,
      ];

      return allTasks;
    },
    queryKey: ['model-tasks', modelTag],
  });

  const renderTaskId = (task: Task) => {
    const shortId = task.id.slice(0, 8);

    if (task.task_type === 'evaluation') {
      return (
        <a
          className="text-primary underline transition hover:opacity-80"
          href={`/evaluation/${task.id}`}
        >
          {shortId}
        </a>
      );
    }

    if (task.task_type === 'training') {
      return (
        <a
          className="text-primary underline transition hover:opacity-80"
          href={`/training/${task.id}`}
        >
          {shortId}
        </a>
      );
    }

    return <span>{shortId}</span>;
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading tasks...</div>;
  }
  if (error) {
    return <div className="text-destructive">Error loading tasks</div>;
  }
  if (tasks.length === 0) {
    return (
      <div className="text-muted-foreground">No tasks for this model.</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Ended</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-mono text-xs">
              {renderTaskId(task)}
            </TableCell>
            <TableCell>{TASKS_TYPE_MAP[task.task_type]}</TableCell>
            <TableCell>{getRoleDisplay(task)}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center gap-1 text-xs ${
                  TASKS_STATUS_MAP[task.task_status].color || ''
                }`}
              >
                {task.task_status === 'F' ? (
                  <TaskErrorHoverCard task={task}>
                    <span className="inline-flex cursor-help items-center gap-1">
                      <X className="h-3 w-3" />
                      {TASKS_STATUS_MAP[task.task_status].label}
                    </span>
                  </TaskErrorHoverCard>
                ) : (
                  TASKS_STATUS_MAP[task.task_status].label
                )}
              </span>
            </TableCell>
            <TableCell>{formatDate(task.created_at)}</TableCell>
            <TableCell>
              {task.end_date ? formatDate(task.end_date) : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
