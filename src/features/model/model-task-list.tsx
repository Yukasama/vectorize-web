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
import type { Task } from '@/features/tasks/types/task';
import { TaskResponse, TaskType } from '@/features/tasks/types/task';
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
  modelId: string;
  modelTag?: string;
}

export const ModelTaskList = ({ modelId, modelTag }: ModelTaskListProps) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useQuery({
    enabled: !!modelId,
    queryFn: async () => {
      console.log(
        '[ModelTaskList] Filtering tasks for model_id:',
        modelId,
        'model_tag:',
        modelTag,
      );
      const allTasks: TaskResponse['items'] = [];

      // Trainings als Basismodell (korrekt: baseline_id)
      const { data: baseTrainings } = await client.get<TaskResponse>(
        `/tasks?baseline_id=${modelId}&task_type=training`,
      );
      allTasks.push(...baseTrainings.items);

      // Trainings als Ergebnis (kein direkter Filter, clientseitig filtern)
      let allTrainings: TaskResponse = {
        items: [],
        limit: 0,
        offset: 0,
        total: 0,
      };
      try {
        const { data } = await client.get<TaskResponse>(
          `/tasks?task_type=training`,
        );
        allTrainings = data;
      } catch {
        // intentionally ignored
      }
      allTasks.push(
        ...allTrainings.items.filter(
          (t: Task & { trained_model_id?: string }) =>
            t.trained_model_id === modelId,
        ),
      );

      // Evaluation als evaluiertes Modell (jetzt mit model_tag statt model_id)
      if (modelTag) {
        const { data: evalMain } = await client.get<TaskResponse>(
          `/tasks?tag=${modelTag}&task_type=evaluation`,
        );
        console.log(
          '[ModelTaskList] Evaluation (tag):',
          evalMain.items.map((t: Task & { tag?: string }) => ({
            id: t.id,
            tag: t.tag,
          })),
        );
        allTasks.push(...evalMain.items);
      }

      const uniqueTasks = allTasks.filter(
        (task, idx, self) => idx === self.findIndex((t) => t.id === task.id),
      );

      uniqueTasks.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      return { items: uniqueTasks };
    },
    queryKey: ['model-tasks', modelId, modelTag],
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading tasks...</div>;
  }
  if (error) {
    return <div className="text-destructive">Error loading tasks</div>;
  }
  if (tasks?.items.length === 0) {
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
        {tasks?.items.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-mono text-xs">
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
