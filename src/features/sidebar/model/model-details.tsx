'use client';

import {
  fetchModelById,
  Model,
} from '@/features/sidebar/services/model-service';
import { formatRelativeDate } from '@/lib/utils';
import Image from 'next/image';
import * as React from 'react';

export const ModelDetailsHoverCardContent = ({
  modelId,
}: {
  modelId: string;
}) => {
  const [model, setModel] = React.useState<Model | null>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (modelId) {
      setLoading(true);
      void fetchModelById(modelId)
        .then((result) => setModel(result ?? undefined))
        .finally(() => setLoading(false));
    }
  }, [modelId]);

  const [copied, setCopied] = React.useState(false);

  const handleCopy = (id: string) => {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-background relative min-w-[180px] rounded-lg p-1 shadow-md">
      {loading && <div>Loading data...</div>}
      {!loading && model && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-base font-semibold">
            {model.name}
            {model.source === 'github' && (
              <Image
                alt="GitHub Logo"
                className="inline-block align-middle"
                height={18}
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                title="GitHub"
                width={18}
              />
            )}
            {model.source === 'huggingface' && (
              <Image
                alt="Hugging Face Logo"
                className="inline-block align-middle"
                height={18}
                src="/images/huggingface_logo.svg"
                title="Hugging Face"
                width={18}
              />
            )}
            {model.source === 'local' && (
              <span
                className="text-muted-foreground inline-block align-middle text-lg"
                title="Local file"
              >
                📄
              </span>
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <b>ID:</b> {model.id}
            <button
              className="hover:bg-accent focus:ring-accent ml-1 rounded px-1 py-0.5 focus:ring-2 focus:outline-none"
              onClick={() => handleCopy(model.id)}
              title="Copy ID"
              type="button"
            >
              <svg
                className="inline align-middle"
                fill="none"
                height="14"
                viewBox="0 0 20 20"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  fill="none"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  width="10"
                  x="7"
                  y="3"
                />
                <rect
                  fill="none"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  width="10"
                  x="3"
                  y="7"
                />
              </svg>
            </button>
            {copied && (
              <span className="ml-1 text-green-600 transition-opacity duration-200">
                Copied
              </span>
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            <b>Created:</b>{' '}
            {model.created_at ? formatRelativeDate(model.created_at) : ''}
          </div>
          <div className="text-muted-foreground absolute right-4 bottom-2 text-right text-xs select-none">
            Updated{' '}
            {model.updated_at ? formatRelativeDate(model.updated_at) : ''}
          </div>
        </div>
      )}
      {!loading && !model && <div>No data found.</div>}
    </div>
  );
};
