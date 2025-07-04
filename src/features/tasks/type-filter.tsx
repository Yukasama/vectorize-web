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
import { ChevronDown, ListFilter, X } from 'lucide-react';
import { TASKS_TYPE_MAP } from './config/mappers';
import { TaskType } from './types/task';

/**
 * Task type filter dropdown for task lists.
 * Supports multi-select and clear-all actions.
 */

interface TypeFilterProps {
  onTypeChange: (types: TaskType[]) => void;
  selectedTypes: TaskType[];
}

export const TypeFilter = ({
  onTypeChange,
  selectedTypes,
}: TypeFilterProps) => {
  // Toggle a type in the selectedTypes array
  const handleTypeToggle = (type: TaskType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex-1 gap-2" variant="outline">
          <ListFilter className="h-4 w-4" />
          <Badge className="ml-1" variant="secondary">
            {selectedTypes.length}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Render a checkbox for each task type */}
        {Object.entries(TASKS_TYPE_MAP).map(([type, label]) => (
          <DropdownMenuCheckboxItem
            checked={selectedTypes.includes(type as TaskType)}
            key={type}
            onCheckedChange={() => handleTypeToggle(type as TaskType)}
          >
            <div className="flex items-center gap-2">
              <span>{label}</span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
        {/* Show clear-all button if any types are selected */}
        {selectedTypes.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Button
              className="w-full justify-start"
              onClick={() => onTypeChange([])}
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
