'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, X } from 'lucide-react';
import { ReactNode } from 'react';
import { fetchTaskErrorDetails } from './services/task-error-service';
import { Task, TaskType } from './types/task';

/**
 * Hover card for showing error details of failed tasks.
 * Fetches and displays error info on hover for failed tasks.
 */

interface TaskErrorHoverCardProps {
  children: ReactNode;
  task: Task | TaskLike;
  taskType?: TaskType;
}

interface TaskLike {
  id?: string;
  status?: string;
  task_id?: string;
  task_status?: string;
  task_type?: TaskType;
}

export const TaskErrorHoverCard = ({
  children,
  task,
  taskType,
}: TaskErrorHoverCardProps) => {
  // Extract task information from either Task or TaskLike object
  const taskId = ('id' in task ? task.id : task.task_id) ?? '';
  const taskStatus =
    ('task_status' in task ? task.task_status : task.status) ?? '';
  // Use explicit taskType if provided, otherwise fallback to task object or default
  const actualTaskType: string =
    taskType ??
    ('task_type' in task ? task.task_type : undefined) ??
    'training';

  // Fetch error details only if task failed and has an ID
  const {
    data: errorDetails,
    error,
    isLoading,
  } = useQuery({
    enabled: taskStatus === 'F' && taskId !== '',
    queryFn: () => fetchTaskErrorDetails(taskId, actualTaskType),
    queryKey: ['task-error', taskId],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // If not failed, just render children
  if (taskStatus !== 'F') {
    return <>{children}</>;
  }

  // Render hover card with error details for failed tasks
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-semibold">Task Failed</h4>
          </div>
          <div className="text-muted-foreground text-sm">
            <strong>Task ID:</strong> {taskId}
          </div>
          <div className="text-muted-foreground text-sm">
            <strong>Type:</strong> {actualTaskType}
          </div>
          {/* Loading state for error details */}
          {isLoading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <div className="border-muted-foreground h-2 w-2 animate-spin rounded-full border border-t-transparent" />
              Loading error details...
            </div>
          )}
          {/* Error fetching error details */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              Unable to load error details
            </div>
          )}
          {/* Show error message if available */}
          {errorDetails?.error_msg && (
            <div className="rounded-md bg-red-50 p-3 text-sm">
              <div className="mb-1 font-medium text-red-800">
                Error Message:
              </div>
              <div className="text-red-700">{errorDetails.error_msg}</div>
            </div>
          )}
          {/* Fallback if no error message is available */}
          {errorDetails && !errorDetails.error_msg && !error && (
            <div className="text-muted-foreground text-sm">
              <div className="mb-1 font-medium">Error Details:</div>
              <div>
                The task failed but no specific error message was captured by
                the system. This could happen if the task was terminated or
                failed before error details could be recorded.
              </div>
              {taskId && (
                <div className="mt-2 text-xs">
                  Task ID:{' '}
                  <code className="bg-muted rounded px-1 py-0.5">{taskId}</code>
                </div>
              )}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
