'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CopyIcon } from 'lucide-react';
import { useState } from 'react';

export const IdCopier = ({ taskId }: { taskId: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(taskId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy ID', error);
    }
  };

  return (
    <Badge
      className="group text-muted-foreground hover:bg-muted cursor-pointer font-mono text-xs"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy ID'}
      variant="outline"
    >
      {taskId.slice(0, 8)}
      <Button
        className="disabled pointer-events-none ml-1 size-4 p-0 transition-all"
        size="icon"
        variant="ghost"
      >
        <span
          className={`relative block transition-transform duration-300 ${
            copied ? 'motion-safe:animate-in fade-in zoom-in scale-110' : ''
          }`}
        >
          {copied ? (
            <Check className="size-3" />
          ) : (
            <CopyIcon className="group-hover:text-muted-foreground size-3" />
          )}
        </span>
      </Button>
    </Badge>
  );
};
