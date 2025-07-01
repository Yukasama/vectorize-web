import { client } from '@/lib/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Task } from './types/task';

/**
 * Polls the tasks endpoint and invalidates models/datasets queries
 * when a relevant task transitions to 'done'.
 */
export const useTaskPollingAndListSync = ({
  maxHours = 1,
}: { maxHours?: number } = {}) => {
  const queryClient = useQueryClient();
  const lastTaskStatus = useRef<Record<string, string>>({});

  const { data: tasks } = useQuery({
    queryFn: () =>
      client.get<Task[]>(`/tasks?within_hours=${maxHours}`).then((r) => r.data),
    queryKey: ['tasks', maxHours],
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (!tasks) {
      return;
    }
    let updated = false;
    for (const task of tasks) {
      const prev = lastTaskStatus.current[task.id];
      if (prev && prev !== 'D' && task.task_status === 'D') {
        if (
          task.task_type === 'training' ||
          task.task_type === 'model_upload'
        ) {
          void queryClient.invalidateQueries({
            exact: false,
            queryKey: ['models'],
          });
          void queryClient.refetchQueries({ queryKey: ['tasks'] });
        }
        if (
          task.task_type === 'dataset_upload' ||
          task.task_type === 'synthesis'
        ) {
          void queryClient.invalidateQueries({
            exact: false,
            queryKey: ['datasets'],
          });
        }
        updated = true;
      }
      lastTaskStatus.current[task.id] = task.task_status;
    }
    if (updated) {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  }, [tasks, queryClient]);
};
