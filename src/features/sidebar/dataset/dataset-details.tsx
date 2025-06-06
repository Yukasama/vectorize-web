import { HoverCardContent } from '@/components/ui/hover-card';
import {
  Dataset,
  fetchDatasetById,
} from '@/features/sidebar/services/dataset-service';
import React, { useEffect, useState } from 'react';

export const DatasetDetailsHoverCard: React.FC<{
  datasetId: string | undefined;
}> = ({ datasetId }) => {
  const [dataset, setDataset] = useState<Dataset | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (datasetId) {
      setLoading(true);
      void fetchDatasetById(datasetId)
        .then((result) => setDataset(result ?? undefined))
        .finally(() => setLoading(false));
    }
  }, [datasetId]);

  return (
    <HoverCardContent align="start" className="w-96" side="right">
      <div className="mb-2 font-semibold">Datensatz Details</div>
      {loading && <div>Lade Daten...</div>}
      {!loading && dataset && (
        <div className="space-y-1 text-sm">
          <div>
            <b>Name:</b> {dataset.name}
          </div>
          <div>
            <b>ID:</b> {dataset.id}
          </div>
          {dataset.file_name && (
            <div>
              <b>Dateiname:</b> {dataset.file_name}
            </div>
          )}
          {dataset.classification && (
            <div>
              <b>Klassifikation:</b> {dataset.classification}
            </div>
          )}
          {dataset.rows !== undefined && (
            <div>
              <b>Zeilen:</b> {dataset.rows}
            </div>
          )}
          {dataset.created_at && (
            <div>
              <b>Erstellt am:</b>{' '}
              {new Date(dataset.created_at).toLocaleString()}
            </div>
          )}
        </div>
      )}
      {!loading && !dataset && <div>Keine Daten gefunden.</div>}
    </HoverCardContent>
  );
};
