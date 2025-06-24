'use client';

import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Clock, X } from 'lucide-react';
import { TASKS_TYPE_MAP } from './config/mappers';
import { IdCopier } from './id-copier';
import { formatDate, useDuration, useRelativeTime } from './lib/date-helpers';
import { Task } from './types/task';

export const TaskCard = ({ task }: { task: Task }) => {
  const duration = useDuration(
    task.created_at,
    task.task_status,
    task.end_date,
  );
  const relative = useRelativeTime(task.created_at);

  return (
    <div className="bg-background relative rounded-xl transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0.5">
        <div className="mb-3 flex flex-1 items-start justify-between">
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-3">
              <h3 className="text-md w-[210px] truncate font-semibold">
                {task.tag ?? 'Synthetic Generation'}
              </h3>
              <IdCopier taskId={task.id} />
            </div>
            <div className="flex justify-between">
              <Badge
                className="h-6 p-0 px-1 text-xs opacity-80"
                variant="secondary"
              >
                {TASKS_TYPE_MAP[task.task_type]}
              </Badge>
              <div className="translate-y-3">
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
                {task.task_status === 'P' && (
                  <div className="flex items-center text-xs text-blue-500">
                    <Loader className="text-blue-500" size={28} />
                    <span className="font-medium">Running...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            task.task_status === 'Q' && 'skeleton-amber',
            task.task_status === 'P' && 'skeleton-blue',
            task.task_status === 'D' && 'bg-emerald-500',
            task.task_status === 'F' && 'bg-red-500',
            task.task_status === 'C' && 'bg-rose-500',
            '-top-1 h-[1px] w-full',
          )}
        />

        <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-sm">
          <div className="flex items-center gap-1">
            {task.task_status === 'D' && (
              <Check className="mt-[1px] h-4 w-4 text-emerald-500" />
            )}
            {task.task_status === 'F' && (
              <X className="mt-0.5 h-4 w-4 text-red-500" />
            )}
            {(task.task_status === 'Q' || task.task_status === 'P') && (
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
    </div>
  );
};
