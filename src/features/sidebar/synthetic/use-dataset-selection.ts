import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import type { Dataset } from '../services/dataset-service';
import { startSyntheticFromDataset } from '../services/synthetic-service';

/**
 * React hook for dataset selection and synthetic generation.
 * Handles multi-select, async state, and error management.
 */
export const useDatasetSelection = (
  open: boolean,
  onSuccess: () => void,
  setTaskId: (id: string) => void,
  setStatus: (status: string) => void,
  setError: (error: string | undefined) => void,
) => {
  // State for selected datasets (multi-select)
  const [localSelectedDatasets, setLocalSelectedDatasets] = useState<Dataset[]>(
    [],
  );
  // Loading state for async actions
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Reset selection when dialog is closed
  useEffect(() => {
    if (!open) {
      setLocalSelectedDatasets([]);
    }
  }, [open]);

  // Handler for selecting/deselecting datasets
  const handleSelect = (dataset: Dataset) => {
    if (localSelectedDatasets.some((d) => d.id === dataset.id)) {
      setLocalSelectedDatasets(
        localSelectedDatasets.filter((d) => d.id !== dataset.id),
      );
    } else {
      setLocalSelectedDatasets([...localSelectedDatasets, dataset]);
    }
  };

  // Handler for starting synthetic generation from a selected dataset
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
      // Invalidate tasks query to refresh task list
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

  // Handler to reset selection manually
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
