import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import type { Dataset } from '../services/dataset-service';
import { startSyntheticFromDataset } from '../services/synthetic-service';

export const useDatasetSelection = (
  open: boolean,
  onSuccess: () => void,
  setTaskId: (id: string) => void,
  setStatus: (status: string) => void,
  setError: (error: string | undefined) => void,
) => {
  const [localSelectedDatasets, setLocalSelectedDatasets] = useState<Dataset[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Reset selection when dialog is closed (React Query pattern)
  useEffect(() => {
    if (!open) {
      setLocalSelectedDatasets([]);
    }
  }, [open]);

  // Dataset select logic (multi-select)
  const handleSelect = (dataset: Dataset) => {
    if (localSelectedDatasets.some((d) => d.id === dataset.id)) {
      setLocalSelectedDatasets(
        localSelectedDatasets.filter((d) => d.id !== dataset.id),
      );
    } else {
      setLocalSelectedDatasets([...localSelectedDatasets, dataset]);
    }
  };

  const handleGenerate = async (datasetId?: string) => {
    if (!datasetId) {
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const res = await startSyntheticFromDataset(datasetId);
      setTaskId(res.task_id);
      setStatus('started');
      void queryClient.invalidateQueries({ exact: false, queryKey: ['tasks'] });
      onSuccess();
    } catch (error_) {
      let message = 'Failed to start synthetic generation';
      if (error_ instanceof Error) {
        message = error_.message || message;
      } else if (typeof error_ === 'object' && error_ && 'message' in error_) {
        message = String((error_ as { message?: unknown }).message) || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = useCallback(() => {
    setLocalSelectedDatasets([]);
  }, []);

  return {
    handleGenerate,
    handleSelect,
    loading,
    localSelectedDatasets,
    resetSelection,
  };
};
