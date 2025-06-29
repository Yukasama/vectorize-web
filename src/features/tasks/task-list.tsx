'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Clock,
  RefreshCw,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { filterTasks } from './lib/filter-tasks';
import { StatusFilter } from './status-filter';
import { TaskCard } from './task-card';
import { TimeFilter } from './time-filter';
import { TypeFilter } from './type-filter';
import { Task, TaskStatus, TaskType } from './types/task';
import { useTaskPollingAndListSync } from './use-task-polling';

export const TaskList = () => {
  useTaskPollingAndListSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>([]);
  const [maxHours, setMaxHours] = useState(1);

  const { data, isError, isFetching, refetch } = useQuery({
    queryFn: () =>
      client.get<Task[]>(`/tasks?within_hours=${maxHours}`).then((r) => r.data),
    queryKey: ['tasks', maxHours],
  });

  const filteredTasks = useMemo(() => {
    if (!data) {
      return [];
    }

    return filterTasks(data, {
      searchQuery,
      selectedStatuses,
      selectedTypes,
    });
  }, [data, selectedStatuses, selectedTypes, searchQuery]);

  return (
    <div className="h-[calc(100vh-80px)] space-y-2" data-testid="task-list">
      <div className="flex items-center gap-3">
        <h3 className="text-md font-medium">Tasks</h3>
        <Separator className="bg-desc/50 flex-1" />
        <p className="text-desc text-xs">
          Showing {filteredTasks.length} of {data?.length ?? 0} tasks
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative flex-1">
          <div className="flex items-center justify-between gap-2">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              className="pl-9"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tag, ID, or type..."
              value={searchQuery}
            />
            <Button
              onClick={() => refetch()}
              size="icon"
              title="Refresh"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusFilter
            onStatusChange={setSelectedStatuses}
            selectedStatuses={selectedStatuses}
          />
          <TypeFilter
            onTypeChange={setSelectedTypes}
            selectedTypes={selectedTypes}
          />
          <TimeFilter maxHours={maxHours} onMaxHoursChange={setMaxHours} />
        </div>
      </div>

      {isError && (
        <Card className="py-12 text-center">
          <CardContent>
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
            <CardTitle className="mb-2">Failed to fetch tasks</CardTitle>
            <CardDescription>
              There was an error fetching the task list.
            </CardDescription>
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => refetch()}
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!isError && isFetching && !data && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((key) => (
            <div className="h-28 space-y-3 rounded-xl border p-5" key={key}>
              <div className="flex justify-between">
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-6 w-20 rounded" />
              </div>
              <div className="skeleton h-3 w-1/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}

      {!isError && !isFetching && filteredTasks.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <CardTitle className="mb-2">No tasks found</CardTitle>
            <CardDescription>
              {data?.length === 0
                ? 'Your task queue is empty.'
                : 'No tasks match your current filters. Try adjusting your search criteria.'}
            </CardDescription>
            {(selectedStatuses.length > 0 ||
              selectedTypes.length > 0 ||
              searchQuery) && (
              <Button
                className="mt-4"
                onClick={() => {
                  setSelectedStatuses([]);
                  setSelectedTypes([]);
                  setSearchQuery('');
                }}
                variant="outline"
              >
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!isError && !isFetching && filteredTasks.length > 0 && (
        <div className="hide-scrollbar h-full space-y-4 overflow-y-auto scroll-auto pt-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
