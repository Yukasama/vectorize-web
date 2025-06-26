'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PopoverClose } from '@radix-ui/react-popover';
import { ChevronDown, Filter, Timer, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TASKS_STATUS_MAP } from './config/mappers';
import { TaskStatus } from './types/task';

interface StatusFilterProps {
  onStatusChange: (statuses: TaskStatus[]) => void;
  selectedStatuses: TaskStatus[];
}

export const StatusFilter = ({
  onStatusChange,
  selectedStatuses,
}: StatusFilterProps) => {
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
        <Button className="flex-1 gap-2" variant="outline">
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
        {Object.entries(TASKS_STATUS_MAP).map(
          ([status, { color, Icon, label }]) => (
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
          ),
        )}
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

interface TimeFilterProps {
  maxHours: number;
  onMaxHoursChange: (hours: number) => void;
}

type TimeUnit = 'd' | 'h' | 'm';

const UNITS: Record<
  TimeUnit,
  { factor: number; label: string; max: number; min: number }
> = {
  d: { factor: 24, label: 'days', max: 999, min: 1 },
  h: { factor: 1, label: 'hours', max: 99, min: 1 },
  m: { factor: 1 / 60, label: 'minutes', max: 59, min: 1 },
};

export const TimeFilter = ({ maxHours, onMaxHoursChange }: TimeFilterProps) => {
  const [unit, setUnit] = useState<TimeUnit>(() =>
    // eslint-disable-next-line unicorn/no-nested-ternary, sonarjs/no-nested-conditional
    maxHours % 24 === 0 ? 'd' : maxHours < 1 ? 'm' : 'h',
  );

  const [value, setValue] = useState(() => {
    const base = UNITS[unit];
    return (maxHours / base.factor).toString();
  });

  const badge = useMemo(() => `${value}${unit}`, [value, unit]);

  const apply = () => {
    const num = Number.parseInt(value, 10);
    const { factor, max, min } = UNITS[unit];

    if (Number.isFinite(num) && num >= min && num <= max) {
      onMaxHoursChange(num * factor);
    }
  };

  const { max, min } = UNITS[unit];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex-1 gap-2" variant="outline">
          <Timer className="h-4 w-4" />
          Finished
          <Badge className="ml-1" variant="secondary">
            {badge}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-background w-80">
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
              max={max}
              min={min}
              onChange={(e) => setValue(e.target.value)}
              type="number"
              value={value}
            />

            <select
              className="rounded-md border px-2 py-1 text-sm"
              onChange={(e) => setUnit(e.target.value as TimeUnit)}
              value={unit}
            >
              <option value="m">minutes</option>
              <option value="h">hours</option>
              <option value="d">days</option>
            </select>
          </div>

          <PopoverClose asChild>
            <Button className="w-full" onClick={apply} size="sm">
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
