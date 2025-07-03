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
import { Task } from '@/features/tasks/types/task';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

interface EvaluationListProps {
  currentEvaluationId?: string;
  datasetId?: null | string;
  modelTag?: null | string;
}

export const EvaluationList = ({
  currentEvaluationId,
  datasetId,
  modelTag,
}: EvaluationListProps) => {
  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    enabled: !!(modelTag && datasetId),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('task_type', 'evaluation');
      params.append('limit', '50'); // Get more to filter locally

      const { data } = await client.get<Task[]>(`/tasks?${params.toString()}`);

      // Filter evaluations that match both model and dataset
      const relevantEvaluations = [];
      for (const task of data) {
        if (
          task.task_type === 'evaluation' &&
          task.id !== currentEvaluationId
        ) {
          try {
            // Fetch evaluation details to check model and dataset
            const evalResponse = await client.get<EvaluationStatusResponse>(
              `/evaluation/${task.id}/status`,
            );
            const evalData = evalResponse.data;

            if (
              evalData.model_tag === modelTag &&
              evalData.dataset_info?.includes(datasetId ?? '')
            ) {
              relevantEvaluations.push(task);
            }
          } catch {
            // Skip this evaluation if we can't fetch its details
          }
        }
      }

      const sortedEvaluations = relevantEvaluations.toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      return sortedEvaluations.slice(0, 10);
    },
    queryKey: ['related-evaluations', modelTag, datasetId, currentEvaluationId],
  });

  if (!modelTag || !datasetId) {
    return (
      <div className="text-muted-foreground">
        No model or dataset information available for related evaluations.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground">
        Loading related evaluations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">Error loading related evaluations</div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-muted-foreground">
        No other evaluations found for this model and dataset combination.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-mono text-xs">
              <a
                className="text-primary underline transition hover:opacity-80"
                href={`/evaluation/${task.id}`}
              >
                {task.id.slice(0, 8)}
              </a>
            </TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
