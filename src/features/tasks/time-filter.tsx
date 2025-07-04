'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { Timer } from 'lucide-react';
import { useState } from 'react';

/**
 * Time filter popover for hiding old completed tasks.
 * Lets user set max age (in hours) for visible tasks.
 */

interface TimeFilterProps {
  maxHours: number;
  onMaxHoursChange: (hours: number) => void;
}

export const TimeFilter = ({ maxHours, onMaxHoursChange }: TimeFilterProps) => {
  // Local state for input value
  const [inputValue, setInputValue] = useState(maxHours.toString());

  // Apply the new max hours if valid
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
          <Badge className="ml-1" variant="secondary">
            {maxHours}h
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
              min="1"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hours"
              type="number"
              value={inputValue}
            />
            <p className="text-muted-foreground text-sm">hours</p>
          </div>
          <PopoverClose asChild>
            <Button className="w-full" onClick={handleApply} size="sm">
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
