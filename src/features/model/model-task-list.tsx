import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import { Task, TaskType } from '@/features/tasks/types/task';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';

export const TASKS_TYPE_MAP: Record<TaskType, string> = {
  dataset_upload: 'Dataset Upload',
  evaluation: 'Evaluation',
  model_upload: 'Model Upload',
  synthesis: 'Synthesis',
  training: 'Training',
};

interface ModelTaskListProps {
  modelTag: string;
}

export const ModelTaskList = ({ modelTag }: ModelTaskListProps) => {
  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    enabled: !!modelTag,
    queryFn: async () => {
      const taskTypes = ['training', 'evaluation'];
      const params = new URLSearchParams({ tag: modelTag });
      for (const type of taskTypes) {
        params.append('task_type', type);
      }
      const { data } = await client.get<Task[]>(`/tasks?${params.toString()}`);
      return data;
    },
    queryKey: ['model-tasks', modelTag],
  });

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
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Ended</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-mono text-xs">
              {task.task_type === 'evaluation' ? (
                <a
                  className="text-primary underline transition hover:opacity-80"
                  href={`/evaluation/${task.id}`}
                >
                  {task.id.slice(0, 8)}
                </a>
              ) : (
                task.id.slice(0, 8)
              )}
            </TableCell>
            <TableCell>{TASKS_TYPE_MAP[task.task_type]}</TableCell>
            <TableCell>{TASKS_STATUS_MAP[task.task_status].label}</TableCell>
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
