'use client';

import type { Dataset } from '../services/dataset-service';
import type { FileUploadState } from './upload-mode';

/**
 * Props for configuring the synthetic data action button.
 */
export interface GetActionButtonProps {
  fileStates: FileUploadState[];
  handleGenerate: (datasetId?: string) => Promise<void>;
  handleUploadMedia: () => Promise<void>;
  loading: boolean;
  localSelectedDatasets: Dataset[];
  mode: 'select' | 'upload';
  taskId: null | string | undefined;
  uploading: boolean;
}

/**
 * Returns props for the synthetic data action button based on current state.
 * Handles disabled state, label, and click handler for both upload and select modes.
 */
export const getActionButtonProps = ({
  fileStates,
  handleGenerate,
  handleUploadMedia,
  loading,
  localSelectedDatasets,
  mode,
  taskId,
  uploading,
}: GetActionButtonProps) => {
  // Determine if the button should be disabled
  const disabled =
    (mode === 'upload' && (fileStates.length === 0 || uploading || !!taskId)) ||
    (mode === 'select' &&
      (localSelectedDatasets.length === 0 || loading || !!taskId || uploading));
  // Set the click handler based on mode
  const onClick =
    mode === 'upload'
      ? handleUploadMedia
      : async () => {
          if (localSelectedDatasets.length > 0) {
            await handleGenerate(localSelectedDatasets[0].id);
          }
        };
  // Set the button label based on mode and state
  let label = '';
  if (mode === 'upload') {
    label = uploading ? 'Uploading…' : 'Upload & Generate';
  } else {
    label = loading ? 'Starting…' : 'Generate from Dataset';
  }
  return { disabled, label, onClick };
};
