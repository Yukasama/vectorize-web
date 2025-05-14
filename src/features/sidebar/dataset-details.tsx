import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Dataset,
  fetchDatasetById,
} from '@/features/sidebar/services/dataset-service';
import React, { useEffect, useState } from 'react';

interface Props {
  datasetId: string | undefined;
  onClose: () => void;
  open: boolean;
}

export const DatasetDetailsDialog: React.FC<Props> = ({
  datasetId,
  onClose,
  open,
}) => {
  const [dataset, setDataset] = useState<Dataset | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && datasetId) {
      setLoading(true);
      void fetchDatasetById(datasetId)
        .then(setDataset)
        .finally(() => setLoading(false));
    }
  }, [open, datasetId]);

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Datensatz Details</DialogTitle>
          <DialogDescription>{loading && 'Lade Daten...'}</DialogDescription>
          {!loading && dataset && (
            <div className="mt-2 space-y-2">
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
