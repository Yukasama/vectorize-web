'use client';

import { DetailsHoverCard } from '@/components/ui/details-hover-card';
import { fetchModelById } from '@/features/sidebar/services/model-service';
import { formatRelativeDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import * as React from 'react';

export const ModelDetailsHoverCardContent = ({
  modelId,
}: {
  modelId: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  const { data: model, isLoading: loading } = useQuery({
    enabled: !!modelId,
    queryFn: () => fetchModelById(modelId),
    queryKey: ['model', modelId],
  });

  const handleCopy = (id: string) => {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <DetailsHoverCard
      copied={copied}
      createdAt={model?.created_at ? formatRelativeDate(model.created_at) : ''}
      createdAtBelowId
      id={model?.id ?? ''}
      loading={loading}
      onCopy={handleCopy}
      title={model?.name ?? ''}
      updatedAt={model?.updated_at ? formatRelativeDate(model.updated_at) : ''}
    >
      {model?.source === 'github' && (
        <Image
          alt="GitHub Logo"
          className="inline-block align-middle"
          height={18}
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          title="GitHub"
          width={18}
        />
      )}
      {model?.source === 'huggingface' && (
        <Image
          alt="Hugging Face Logo"
          className="inline-block align-middle"
          height={18}
          src="/images/huggingface_logo.svg"
          title="Hugging Face"
          width={18}
        />
      )}
      {model?.source === 'local' && (
        <span
          className="text-muted-foreground inline-block align-middle text-lg"
          title="Local file"
        >
          📄
        </span>
      )}
    </DetailsHoverCard>
  );
};
