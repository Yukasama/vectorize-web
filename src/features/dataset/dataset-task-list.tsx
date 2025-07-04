import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TASKS_STATUS_MAP,
  TASKS_TYPE_MAP,
} from '@/features/tasks/config/mappers';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import type { Task } from '@/features/tasks/types/task';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import { TaskResponse } from '../tasks/types/task';

interface DatasetTaskListProps {
  datasetId: string;
}

interface TaskListResponse {
  items: Task[];
  limit: number;
  offset: number;
  total: number;
}

const isTaskListResponse = (obj: unknown): obj is TaskListResponse => {
  // Check if the object is a valid TaskListResponse
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray((obj as TaskListResponse).items)
  );
};

const fetchTasks = async (datasetId: string) => {
  // Helper to fetch JSON data from the backend
  const fetchJson = async (url: string): Promise<unknown> => {
    const { data } = await client.get<TaskResponse>(url);
    return data;
  };
  // Fetch both training and evaluation tasks for the dataset
  const [trainingsRaw, evaluationsRaw]: [unknown, unknown] = await Promise.all([
    fetchJson(`/tasks?dataset_id=${datasetId}&task_type=training`),
    fetchJson(`/tasks?dataset_id=${datasetId}&task_type=evaluation`),
  ]);
  // Normalize trainings data to Task[]
  let trainings: Task[] = [];
  if (Array.isArray(trainingsRaw)) {
    trainings = trainingsRaw as Task[];
  } else if (isTaskListResponse(trainingsRaw)) {
    trainings = trainingsRaw.items;
  } else if (trainingsRaw) {
    trainings = [trainingsRaw as Task];
  }
  // Normalize evaluations data to Task[]
  let evaluations: Task[] = [];
  if (Array.isArray(evaluationsRaw)) {
    evaluations = evaluationsRaw as Task[];
  } else if (isTaskListResponse(evaluationsRaw)) {
    evaluations = evaluationsRaw.items;
  } else if (evaluationsRaw) {
    evaluations = [evaluationsRaw as Task];
  }
  // Merge, deduplicate, and sort all tasks by creation date (descending)
  const all = [...trainings, ...evaluations];
  const deduped = [...new Map(all.map((t) => [t.id, t])).values()];
  deduped.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return { items: deduped };
};

export const DatasetTaskList = ({ datasetId }: DatasetTaskListProps) => {
  // Fetch all tasks for the given dataset
  const {
    data: tasks,
    error,
    isLoading,
  } = useQuery({
    enabled: !!datasetId,
    queryFn: () => fetchTasks(datasetId),
    queryKey: ['dataset-tasks', datasetId],
  });

  if (isLoading) {
    // Show loading state while fetching tasks
    return <div className="text-muted-foreground">Loading tasks…</div>;
  }
  if (error) {
    // Show error state if tasks could not be loaded
    return <div className="text-destructive">Error loading tasks</div>;
  }
  if (!tasks || tasks.items.length === 0) {
    // Show message if there are no tasks for this dataset
    return (
      <div className="text-muted-foreground">No tasks for this dataset.</div>
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
        {tasks.items.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-mono text-xs">
              {/* Render a link for evaluation/training tasks, otherwise just show the ID */}
              {(() => {
                if (task.task_type === 'evaluation') {
                  return (
                    <a
                      className="text-primary underline transition hover:opacity-80"
                      href={`/evaluation/${task.id}`}
                    >
                      {task.id.slice(0, 8)}
                    </a>
                  );
                } else if (task.task_type === 'training') {
                  return (
                    <a
                      className="text-primary underline transition hover:opacity-80"
                      href={`/training/${task.id}`}
                    >
                      {task.id.slice(0, 8)}
                    </a>
                  );
                } else {
                  return <span>{task.id.slice(0, 8)}</span>;
                }
              })()}
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

export default DatasetTaskList;
