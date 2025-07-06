'use client';

import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { fetchModelByIdOrTag } from '@/features/sidebar/services/model-service';
import { cn } from '@/lib/utils';
import { Check, Clock, X } from 'lucide-react';
import { TASKS_TYPE_MAP } from './config/mappers';
import { IdCopier } from './id-copier';
import { formatDate, useDuration, useRelativeTime } from './lib/date-helpers';
import { TaskErrorHoverCard } from './task-error-hover-card';
import { Task } from './types/task';

/**
 * Card UI for displaying a single task with status, actions, and details.
 * Supports click navigation and error/status display.
 */

// Returns the detail URL for a given task, or undefined if not applicable
const getTaskDetailUrl = (task: Task): string | undefined => {
  switch (task.task_type) {
    case 'dataset_upload': {
      return undefined;
    }
    case 'evaluation': {
      return `/evaluation/${task.id}`;
    }
    case 'model_upload': {
      if (task.model_id) {
        return `/model/${task.model_id}`;
      }
      // If only a tag is present, resolve model ID later
      if (task.tag) {
        return 'resolve-model-id';
      }
      return undefined;
    }
    case 'synthesis': {
      return undefined;
    }
    case 'training': {
      return `/training/${task.id}`;
    }
    default: {
      return undefined;
    }
  }
};

// Main card component for a single task
export const TaskCard = ({ task }: { task: Task }) => {
  // Calculate duration and relative time for display
  const duration = useDuration(
    task.created_at,
    task.task_status,
    task.end_date,
  );
  const relative = useRelativeTime(task.created_at);

  // Get the detail URL and determine if the card is clickable
  const detailUrl = getTaskDetailUrl(task);
  const isClickable = !!detailUrl && task.task_status !== 'F';

  // Handle click: navigate or resolve model ID if needed
  const handleClick = async (e: React.MouseEvent) => {
    // Prevent navigation if clicking the ID copier
    if ((e.target as HTMLElement).closest('.id-copier')) {
      return;
    }

    if (detailUrl) {
      // Special case: resolve model ID from tag for model_upload tasks
      if (
        detailUrl === 'resolve-model-id' &&
        task.task_type === 'model_upload' &&
        task.tag
      ) {
        e.preventDefault();
        try {
          // Normalize tag and fetch model by tag
          const normalizedTag = task.tag.replace('/', '_').replace('@main', '');
          const model = await fetchModelByIdOrTag(normalizedTag);
          if (model?.id) {
            globalThis.location.href = `/model/${model.id}`;
          }
        } catch {
          // Swallow error silently
        }
        return;
      }
      // Navigate to detail URL
      globalThis.location.href = detailUrl;
    }
  };

  // Card content: header, status, and meta info
  const cardContent = (
    <CardContent className="p-0.5">
      <div className="mb-3 flex flex-1 items-start justify-between">
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-3">
            <h3 className="text-md w-[210px] truncate font-semibold">
              {task.task_type === 'synthesis'
                ? 'Synthetic Generation'
                : task.tag}
            </h3>
            <div className="id-copier">
              <IdCopier taskId={task.id} />
            </div>
          </div>
          <div className="flex justify-between">
            <Badge
              className="h-6 p-0 px-1 text-xs opacity-90"
              variant="secondary"
            >
              {TASKS_TYPE_MAP[task.task_type]}
            </Badge>
            <div className="translate-y-3">
              {/* Status indicators for queue and running */}
              {task.task_status === 'Q' && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <div className="flex gap-0.5">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                    <div
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                  <span className="font-medium">Waiting in queue</span>
                </div>
              )}
              {task.task_status === 'R' && (
                <div className="flex items-center text-xs text-blue-500">
                  <Loader className="text-blue-500" size={28} />
                  <span className="font-medium">Running...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar color based on task status */}
      <div
        className={cn(
          task.task_status === 'Q' && 'skeleton-amber',
          task.task_status === 'R' && 'skeleton-blue',
          task.task_status === 'D' && 'bg-emerald-500',
          task.task_status === 'F' && 'bg-red-500',
          '-top-1 h-[1px] min-h-[1px] w-full',
        )}
      />

      {/* Footer: status icon, duration, and creation date */}
      <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-sm">
        <div className="flex items-center gap-1">
          {/* Status icon for done, failed, or running/queued */}
          {task.task_status === 'D' && (
            <Check className="mt-[1px] h-4 w-4 text-emerald-500" />
          )}
          {task.task_status === 'F' && (
            <TaskErrorHoverCard task={task}>
              <X className="mt-0.5 h-4 w-4 cursor-help text-red-500" />
            </TaskErrorHoverCard>
          )}
          {(task.task_status === 'Q' || task.task_status === 'R') && (
            <Clock className="h-4 w-4" />
          )}
          <span>{duration}</span>
        </div>
        <div className="text-right">
          <div>{formatDate(task.created_at)}</div>
          <div className="text-xs">({relative})</div>
        </div>
      </div>
    </CardContent>
  );

  // Render clickable button or static card based on status
  if (isClickable) {
    return (
      <button
        className={cn(
          'bg-background hover:bg-muted/30 relative w-full cursor-pointer rounded-xl text-left transition-all duration-200 hover:shadow-md',
        )}
        onClick={handleClick}
        type="button"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="bg-background relative w-full rounded-xl text-left transition-all duration-200 hover:shadow-md">
      {cardContent}
    </div>
  );
};
