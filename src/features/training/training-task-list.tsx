import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  fetchFineTuneTrainingTasks,
  fetchFineTuneTrainingTasksByModelId,
  TrainingTaskResponse,
} from '@/features/service-starter/training-service';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import { TaskErrorHoverCard } from '@/features/tasks/task-error-hover-card';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

interface TrainingTaskListProps {
  currentTrainingId?: string;
  datasetIds?: string[];
  modelId?: string;
  modelTag?: string;
}

export const TrainingTaskList = ({
  currentTrainingId,
  datasetIds,
  modelId,
  modelTag,
}: TrainingTaskListProps) => {
  const {
    data: trainings = [],
    error,
    isLoading,
  } = useQuery({
    enabled: !!(modelTag ?? modelId),
    queryFn: async () => {
      if (!modelTag && !modelId) {
        return [];
      }

      try {
        // Get all training tasks for this base model
        let allTrainings: TrainingTaskResponse[];
        if (modelId) {
          allTrainings = await fetchFineTuneTrainingTasksByModelId(modelId);
        } else if (modelTag) {
          allTrainings = await fetchFineTuneTrainingTasks(modelTag);
        } else {
          allTrainings = [];
        }

        // Filter trainings
        let relevantTrainings = allTrainings.filter(
          (training: TrainingTaskResponse) =>
            // Exclude the current training if it exists
            !(currentTrainingId && training.task_id === currentTrainingId),
        );

        // If dataset IDs are provided, further filter by datasets
        if (datasetIds && datasetIds.length > 0) {
          relevantTrainings = relevantTrainings.filter(
            (training: TrainingTaskResponse) => {
              if (!training.train_dataset_ids) {
                return false;
              }
              // Check if any of the provided dataset IDs match
              return datasetIds.some((id) =>
                training.train_dataset_ids?.includes(id),
              );
            },
          );
        }

        // Sort by creation date (newest first) using toSorted
        const sortedTrainings = relevantTrainings.toSorted(
          (a: TrainingTaskResponse, b: TrainingTaskResponse) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        // Take only the last 10 trainings
        return sortedTrainings.slice(0, 10);
      } catch (error) {
        console.error('Error fetching training tasks:', error);
        return [];
      }
    },
    queryKey: ['training-tasks', modelTag, modelId, datasetIds?.join(',')],
  });

  if (!modelTag && !modelId) {
    return (
      <div className="text-muted-foreground">
        Debug: No model tag or model ID available for training history.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground">
        Debug: Loading trainings for model: {modelTag ?? modelId}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Debug: Error loading trainings: {String(error)}
      </div>
    );
  }

  if (trainings.length === 0) {
    return (
      <div className="text-muted-foreground">
        No previous trainings found for this model
        {datasetIds && datasetIds.length > 0
          ? ' with the specified datasets'
          : ''}
        .
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Training History</h3>
      <p className="text-muted-foreground text-sm">
        Debug: Found {trainings.length} training(s) for model{' '}
        {modelTag ?? modelId}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Training ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainings.map((training: TrainingTaskResponse) => {
            const duration =
              training.created_at && training.end_date
                ? Math.round(
                    (new Date(training.end_date).getTime() -
                      new Date(training.created_at).getTime()) /
                      (1000 * 60),
                  )
                : undefined;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            const statusEntry = (TASKS_STATUS_MAP as Record<string, any>)[
              training.status
            ];

            return (
              <TableRow key={training.task_id}>
                <TableCell className="font-mono text-xs">
                  <a
                    className="text-primary underline transition hover:opacity-80"
                    href={`/training/${training.task_id}`}
                  >
                    {training.task_id.slice(0, 8)}
                  </a>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      statusEntry?.color ?? ''
                    }`}
                  >
                    {training.status === 'F' ? (
                      <TaskErrorHoverCard task={training} taskType="training">
                        <span className="inline-flex cursor-help items-center gap-1">
                          <X className="h-3 w-3" />
                          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                          {statusEntry?.label ?? training.status}
                        </span>
                      </TaskErrorHoverCard>
                    ) : (
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      (statusEntry?.label ?? training.status)
                    )}
                  </span>
                </TableCell>
                <TableCell>{formatDate(training.created_at)}</TableCell>
                <TableCell>
                  {training.end_date ? formatDate(training.end_date) : '-'}
                </TableCell>
                <TableCell>{duration ? `${duration} min` : '-'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
