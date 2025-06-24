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
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { ChevronDown, Filter, Timer, X } from 'lucide-react';
import { useState } from 'react';
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

export const TimeFilter = ({ maxHours, onMaxHoursChange }: TimeFilterProps) => {
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
            <p className="text-muted-foreground text-sm">hours</p>
          </div>
          <Button className="w-full" onClick={handleApply} size="sm">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
