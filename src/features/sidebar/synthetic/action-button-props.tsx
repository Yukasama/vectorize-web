import type { Dataset } from '../services/dataset-service';
import type { FileUploadState } from './upload-mode';

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
  const disabled =
    (mode === 'upload' && (fileStates.length === 0 || uploading || !!taskId)) ||
    (mode === 'select' &&
      (localSelectedDatasets.length === 0 || loading || !!taskId || uploading));
  const onClick =
    mode === 'upload'
      ? handleUploadMedia
      : async () => {
          if (localSelectedDatasets.length > 0) {
            await handleGenerate(localSelectedDatasets[0].id);
          }
        };
  let label = '';
  if (mode === 'upload') {
    label = uploading ? 'Uploading…' : 'Upload & Generate';
  } else {
    label = loading ? 'Starting…' : 'Generate from Dataset';
  }
  return { disabled, label, onClick };
};
