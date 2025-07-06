'use client';

import { DetailsHoverCard } from '@/components/ui/details-hover-card';
import { fetchModelById } from '@/features/sidebar/services/model-service';
import { formatRelativeDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import * as React from 'react';

/**
 * ModelDetailsHoverCardContent displays model details in a hover card.
 * Fetches model info by ID and provides copy-to-clipboard for ID and tag.
 * Shows source icon for GitHub, Hugging Face, or local models.
 */
export const ModelDetailsHoverCardContent = ({
  modelId,
}: {
  modelId: string;
}) => {
  const [copiedId, setCopiedId] = React.useState(false);
  const [copiedTag, setCopiedTag] = React.useState(false);
  const { data: model, isLoading: loading } = useQuery({
    enabled: !!modelId,
    queryFn: () => fetchModelById(modelId),
    queryKey: ['model', modelId],
  });

  // Handles copying the model ID to clipboard
  const handleCopy = (id: string) => {
    void navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1200);
  };

  // Handles copying the model tag to clipboard
  const handleCopyTag = (tag: string) => {
    void navigator.clipboard.writeText(tag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 1200);
  };

  return (
    <DetailsHoverCard
      copied={copiedId}
      copiedTag={copiedTag}
      createdAt={model?.created_at ? formatRelativeDate(model.created_at) : ''}
      id={model?.id ?? ''}
      loading={loading}
      onCopy={handleCopy}
      onCopyTag={model?.model_tag ? handleCopyTag : undefined}
      tag={model?.model_tag ?? ''}
      title={model?.name ?? ''}
    >
      {/* Show source icon for GitHub, Hugging Face, or local */}
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
