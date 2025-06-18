'use client';

import { DetailsHoverCard } from '@/components/ui/details-hover-card';
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
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (datasetId) {
      setLoading(true);
      void fetchDatasetById(datasetId)
        .then((result) => setDataset(result ?? undefined))
        .finally(() => setLoading(false));
    }
  }, [datasetId]);

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
