'use client';

import {
  fetchModelById,
  Model,
} from '@/features/sidebar/services/model-service';
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

  return (
    <div className="p-2">
      {loading && <div>Loading data...</div>}
      {!loading && model && (
        <div className="space-y-1 text-sm">
          <div>{model.name}</div>
          <div>
            <b>ID:</b> {model.id}
          </div>
          <div>
            <b>Tag:</b> {model.model_tag}
          </div>
          <div>
            <b>Created at:</b> {new Date(model.created_at).toLocaleString()}
          </div>
          <div>
            <b>Updated at:</b> {new Date(model.updated_at).toLocaleString()}
          </div>
        </div>
      )}
      {!loading && !model && <div>No data found.</div>}
    </div>
  );
};
