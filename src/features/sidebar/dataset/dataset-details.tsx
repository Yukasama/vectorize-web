'use client';

import { DetailsHoverCard } from '@/components/ui/details-hover-card';
import { fetchDatasetById } from '@/features/sidebar/services/dataset-service';
import { formatRelativeDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

/**
 * DatasetDetailsHoverCard displays dataset details in a hover card.
 * Fetches dataset info by ID and provides copy-to-clipboard functionality.
 */
export const DatasetDetailsHoverCard = ({
  datasetId,
}: {
  datasetId: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  const { data: dataset, isLoading: loading } = useQuery({
    enabled: !!datasetId,
    queryFn: () => fetchDatasetById(datasetId),
    queryKey: ['dataset', datasetId],
  });

  // Handles copying the dataset ID to clipboard
  const handleCopy = (id: string) => {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <DetailsHoverCard
      copied={copied}
      createdAt={
        dataset?.created_at ? formatRelativeDate(dataset.created_at) : ''
      }
      id={dataset?.id ?? ''}
      loading={loading}
      onCopy={handleCopy}
      title={dataset?.name ?? ''}
    />
  );
};
