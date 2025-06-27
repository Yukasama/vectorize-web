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
import { cn } from '@/lib/utils';
import { ChevronDown, Filter, X } from 'lucide-react';
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
