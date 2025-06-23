'use client';

import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { IdCopier } from './id-copier';
import { formatDate, useDuration, useRelativeTime } from './lib/date-helpers';
import { Task, TaskStatus, TaskType } from './types/task';

const STATUS_MAP: Record<
  TaskStatus,
  {
    animate?: boolean;
    badgeColor: string;
    color: string;
    description: string;
    Icon: typeof CheckCircle;
    label: string;
  }
> = {
  C: {
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
    color: 'text-gray-600',
    description: 'Task was cancelled',
    Icon: AlertCircle,
    label: 'Cancelled',
  },
  D: {
    badgeColor: 'bg-green-100 text-green-700 border-green-300',
    color: 'text-green-600',
    description: 'Task completed successfully',
    Icon: CheckCircle,
    label: 'Completed',
  },
  F: {
    badgeColor: 'bg-red-100 text-red-700 border-red-300',
    color: 'text-red-600',
    description: 'Task failed to complete',
    Icon: XCircle,
    label: 'Failed',
  },
  P: {
    animate: true,
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
    color: 'text-blue-600',
    description: 'Task is currently running',
    Icon: Loader2,
    label: 'Running',
  },
  Q: {
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
    color: 'text-amber-600',
    description: 'Task is waiting to be processed',
    Icon: Clock,
    label: 'Queued',
  },
};

const TYPE_MAP: Record<TaskType, string> = {
  dataset_upload: 'Dataset Upload',
  model_upload: 'Model Upload',
  synthetis: 'Synthesis',
};

const TaskCard = ({ task }: { task: Task }) => {
  const duration = useDuration(
    task.created_at,
    task.task_status,
    task.end_date,
  );
  const relative = useRelativeTime(task.created_at);

  return (
    <div className="bg-background relative rounded-xl border-none transition-all duration-200 hover:shadow-md">
      <CardContent className="p-3 px-4">
        <div className="mb-3 flex flex-1 items-start justify-between">
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-3">
              <h3 className="text-md font-semibold">
                {task.tag ?? 'Synthetic Generation'}
              </h3>
              <IdCopier taskId={task.id} />
            </div>
            <div className="flex justify-between">
              <Badge
                className="h-6 p-0 px-1 text-xs opacity-80"
                variant="secondary"
              >
                {TYPE_MAP[task.task_type]}
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
            task.task_status !== 'Q' && task.task_status !== 'P' && 'bg-accent',
            '-top-1 h-[1px] w-full',
          )}
        />

        <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
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

// ────────────────────────────────────────────────────────────────────────────────
// 🔍 Filter components
// ────────────────────────────────────────────────────────────────────────────────
const StatusFilter = ({
  onStatusChange,
  selectedStatuses,
}: {
  onStatusChange: (statuses: TaskStatus[]) => void;
  selectedStatuses: TaskStatus[];
}) => {
  const handleStatusToggle = (status: TaskStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" variant="outline">
          <Filter className="h-4 w-4" />
          Status
          <Badge className="ml-1" variant="secondary">
            {selectedStatuses.length}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(STATUS_MAP).map(([status, { color, Icon, label }]) => (
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes(status as TaskStatus)}
            key={status}
            onCheckedChange={() => handleStatusToggle(status as TaskStatus)}
          >
            <div className="flex items-center gap-2">
              <Icon className={cn('h-4 w-4', color)} />
              {label}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
        {selectedStatuses.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Button
              className="w-full justify-start"
              onClick={() => onStatusChange([])}
              size="sm"
              variant="ghost"
            >
              <X className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TimeFilter = ({
  maxHours,
  onMaxHoursChange,
}: {
  maxHours: number;
  onMaxHoursChange: (hours: number) => void;
}) => {
  const [inputValue, setInputValue] = useState(maxHours.toString());

  const handleApply = () => {
    const hours = Number.parseInt(inputValue);
    if (!Number.isNaN(hours) && hours > 0) {
      onMaxHoursChange(hours);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="gap-2" variant="outline">
          <Timer className="h-4 w-4" />
          Finished
          <Badge className="ml-1" variant="secondary">
            {maxHours}h
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Hide completed tasks after</h4>
            <p className="text-muted-foreground text-sm">
              Tasks completed longer than this time will be hidden
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              min="1"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hours"
              type="number"
              value={inputValue}
            />
            <Label className="text-muted-foreground text-sm">hours</Label>
          </div>
          <Button className="w-full" onClick={handleApply} size="sm">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// 📋 Main enhanced task list component
// ────────────────────────────────────────────────────────────────────────────────
export const TaskList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [maxHours, setMaxHours] = useState(1);

  const {
    data: tasks,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get<Task[]>('https://localhost/v1/tasks', {
        httpsAgent: new (require('node:https').Agent)({
          rejectUnauthorized: false,
        }),
      });
      return data;
    },
    queryKey: ['tasks'],
    refetchInterval: 10_000,
  });

  const filteredTasks = useMemo(() => {
    if (!tasks) {
      return [];
    }

    return tasks.filter((task) => {
      // Status filter
      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(task.task_status)
      ) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTag = task.tag?.toLowerCase().includes(query);
        const matchesId = task.id.toLowerCase().includes(query);
        const matchesType = TYPE_MAP[task.task_type]
          .toLowerCase()
          .includes(query);
        if (!matchesTag && !matchesId && !matchesType) {
          return false;
        }
      }

      // Time filter - only apply to completed tasks
      if (task.task_status === 'D' && task.end_date) {
        const endTime = new Date(task.end_date).getTime();
        const cutoffTime = Date.now() - maxHours * 60 * 60 * 1000;
        if (endTime < cutoffTime) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, selectedStatuses, searchQuery, maxHours]);

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

      {isFetching && !tasks ? (
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
      ) : filteredTasks.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <CardTitle className="mb-2">No tasks found</CardTitle>
            <CardDescription>
              {tasks?.length === 0
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
