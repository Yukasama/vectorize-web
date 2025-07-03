'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DatasetTaskInfo,
  fetchAllDatasetTasks,
} from '@/features/dataset/dataset-task-service';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import { useQuery } from '@tanstack/react-query';

interface DatasetTaskListProps {
  datasetId: string;
}

export const DatasetTaskList = ({ datasetId }: DatasetTaskListProps) => {
  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    enabled: !!datasetId,
    queryFn: () => fetchAllDatasetTasks(datasetId),
    queryKey: ['dataset-tasks', datasetId],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading task history...</div>;
  }

  if (error) {
    return <div className="text-destructive">Error loading task history</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-muted-foreground">
        No tasks found for this dataset
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Task History</h3>
      <p className="text-muted-foreground text-sm">
        All tasks involving this dataset, including training, evaluation, and
        synthesis operations.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task ID</TableHead>
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
                {getTaskDetailLink(task)}
              </TableCell>
              <TableCell>{getTaskTypeDisplay(task.task_type)}</TableCell>
              <TableCell>
                <span className="text-muted-foreground text-xs">
                  {task.role}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 text-xs ${
                    TASKS_STATUS_MAP[
                      task.status as keyof typeof TASKS_STATUS_MAP
                    ].color || ''
                  }`}
                >
                  {TASKS_STATUS_MAP[
                    task.status as keyof typeof TASKS_STATUS_MAP
                  ].label || task.status}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {formatDate(task.created_at)}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {task.end_date ? formatDate(task.end_date) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/**
 * Helper function to render task ID with appropriate link
 */
const getTaskDetailLink = (task: DatasetTaskInfo) => {
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

/**
 * Helper function to get display name for task types
 */
const getTaskTypeDisplay = (taskType: DatasetTaskInfo['task_type']): string => {
  const typeMap = {
    dataset_upload: 'Dataset Upload',
    evaluation: 'Evaluation',
    synthesis: 'Data Synthesis',
    training: 'Training',
  };

  return typeMap[taskType] || taskType;
};
