'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Clock, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusFilter, TimeFilter } from './filters';
import { filterTasks } from './lib/filter-tasks';
import { TaskCard } from './task-card';
import { Task, TaskStatus } from './types/task';

export const TaskList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [maxHours, setMaxHours] = useState(1);

  const { data, isError, isFetching, refetch } = useQuery({
    queryFn: () => client.get<Task[]>('/tasks').then((r) => r.data),
    queryKey: ['tasks'],
    refetchInterval: 10_000,
  });

  const filteredTasks = useMemo(() => {
    if (!data) {
      return [];
    }

    return filterTasks(data, {
      maxHours,
      searchQuery,
      selectedStatuses,
    });
  }, [data, selectedStatuses, searchQuery, maxHours]);

  if (isError) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" /> Failed to load tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2" data-testid="task-list">
      <div className="flex items-center gap-3">
        <h3 className="text-md font-medium">Tasks</h3>
        <Separator className="bg-desc/50 max-w-24" />
        <p className="text-desc text-xs">Showing 3 of 4 tasks</p>
      </div>
      {/* <div className="flex items-center justify-between">
        <Button
          className={cn({ 'animate-spin': isFetching })}
          onClick={() => refetch()}
          size="icon"
          title="Refresh"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div> */}

      <div className="flex flex-col gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            className="pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tag, ID, or type..."
            value={searchQuery}
          />
        </div>
        <div className="flex w-full gap-2">
          <StatusFilter
            onStatusChange={setSelectedStatuses}
            selectedStatuses={selectedStatuses}
          />
          <TimeFilter maxHours={maxHours} onMaxHoursChange={setMaxHours} />
        </div>
      </div>

      {isFetching && !data && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card className="h-32" key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="bg-muted h-4 w-1/3 rounded" />
                    <div className="bg-muted h-6 w-20 rounded" />
                  </div>
                  <div className="bg-muted h-3 w-1/4 rounded" />
                  <div className="bg-muted h-3 w-1/2 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!isFetching && filteredTasks.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <CardTitle className="mb-2">No tasks found</CardTitle>
            <CardDescription>
              {data?.length === 0
                ? 'Your task queue is empty.'
                : 'No tasks match your current filters. Try adjusting your search criteria.'}
            </CardDescription>
            {(selectedStatuses.length > 0 || searchQuery) && (
              <Button
                className="mt-4"
                onClick={() => {
                  setSelectedStatuses([]);
                  setSearchQuery('');
                }}
                variant="outline"
              >
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
