import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAllDatasets } from '../services/dataset-service';

interface UseDialogStateProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

/**
 * Custom hook to manage dialog state with React Query integration
 * Uses modern React Query patterns with useEffect for state management
 */
export const useDialogState = ({ onOpenChange, open }: UseDialogStateProps) => {
  // Mode: 'upload' (drag-and-drop) or 'select' (dataset list)
  const [mode, setMode] = useState<'select' | 'upload'>('upload');
  // For dataset selection mode
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [taskId, setTaskId] = useState<null | string | undefined>();
  const [status, setStatus] = useState<null | string | undefined>();
  const [error, setError] = useState<null | string | undefined>();

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // React Query for datasets
  const datasetsQuery = useQuery({
    enabled: open, // Only fetch when dialog is open
    queryFn: fetchAllDatasets,
    queryKey: ['datasets'],
  });

  // Reset dialog state when dialog opens
  useEffect(() => {
    if (open) {
      setTaskId(undefined);
      setStatus(undefined);
      setError(undefined);
      setSearch('');
      setView('grid');
      setMode('upload'); // Reset to default mode
    }
  }, [open]);

  // Reset dialog state (exposed for manual reset if needed)
  const resetDialogState = useCallback(() => {
    setTaskId(undefined);
    setStatus(undefined);
    setError(undefined);
    setSearch('');
    setView('grid');
    setMode('upload');
  }, []);

  // Close dialog and trigger cleanup
  const closeDialog = useCallback(() => {
    onOpenChange(false);
    // Dataset selection reset will be handled by the selection hook
  }, [onOpenChange]);

  return {
    // State (alphabetically ordered)
    closeDialog,
    datasetsQuery,
    error,
    fileInputRef,
    mode,
    resetDialogState,
    search,
    setError,
    setMode,
    setSearch,
    setStatus,
    setTaskId,
    setView,
    status,
    taskId,
    view,
  };
};
