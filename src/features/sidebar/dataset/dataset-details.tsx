'use client';

import {
  Dataset,
  fetchDatasetById,
} from '@/features/sidebar/services/dataset-service';
import { formatRelativeDate } from '@/lib/utils';
import * as React from 'react';

export const DatasetDetailsHoverCard = ({
  datasetId,
}: {
  datasetId: string;
}) => {
  const [dataset, setDataset] = React.useState<Dataset | null>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (datasetId) {
      setLoading(true);
      void fetchDatasetById(datasetId)
        .then((result) => setDataset(result ?? undefined))
        .finally(() => setLoading(false));
    }
  }, [datasetId]);

  const [copied, setCopied] = React.useState(false);

  const handleCopy = (id: string) => {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-background relative min-w-[180px] rounded-lg p-1 shadow-md">
      {loading && <div>Loading data...</div>}
      {!loading && dataset && (
        <div className="space-y-2 pb-5 text-sm">
          <div className="text-base font-semibold">{dataset.name}</div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <b>ID:</b> {dataset.id}
            <button
              className="hover:bg-accent focus:ring-accent ml-1 rounded px-1 py-0.5 focus:ring-2 focus:outline-none"
              onClick={() => handleCopy(dataset.id)}
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
          <div className="text-muted-foreground absolute right-4 bottom-2 text-right text-xs select-none">
            Created{' '}
            {dataset.created_at ? formatRelativeDate(dataset.created_at) : ''}
          </div>
        </div>
      )}
      {!loading && !dataset && <div>No data found.</div>}
    </div>
  );
};
