'use client';

import { Badge } from '@/components/ui/badge';
import { Check, CopyIcon } from 'lucide-react';
import { useState } from 'react';

export const IdCopier = ({ taskId }: { taskId: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(taskId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard write failed, do nothing
    }
  };

  return (
    <Badge
      className="group text-muted-foreground hover:bg-muted flex cursor-pointer items-center gap-1 font-mono text-xs"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy ID'}
      variant="outline"
    >
      {taskId.slice(0, 8)}
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
    </Badge>
  );
};
