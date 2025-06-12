import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { DatasetList } from '@/features/service-starter/select-dataset/dataset-list';
import { X } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { Dataset, fetchDatasets } from '../services/dataset-service';
import {
  startSyntheticFromDataset,
  uploadMediaForSynthesis,
} from '../services/synthetic-service';

// File upload state for synthetic media
interface FileUploadState {
  done: boolean;
  error: boolean;
  file: File;
  progress: number;
}

interface SyntheticGenerateDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

interface UploadModeProps {
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileStates: FileUploadState[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleRemoveFile: (index: number) => void;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: null | string | undefined;
  uploading: boolean;
}

const UploadMode = ({
  dragActive,
  fileInputRef,
  fileStates,
  handleChange,
  handleDrop,
  handleRemoveFile,
  setDragActive,
  taskId,
  uploading,
}: UploadModeProps) => (
  <>
    <div
      className={`flex h-56 min-h-[224px] w-full min-w-0 cursor-pointer items-center justify-center rounded border-2 border-dashed transition ${
        dragActive ? 'border-primary bg-muted' : 'border-muted'
      }`}
      onClick={() => fileInputRef.current.click()}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDrop={handleDrop}
    >
      <p className="text-muted-foreground text-sm">
        Drop PDF or media files here or click to select.
      </p>
      <Input
        accept=".pdf,image/*,video/*,audio/*"
        className="hidden"
        disabled={uploading || !!taskId}
        multiple
        onChange={handleChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
    <div className="bg-muted mt-2 flex-shrink-0 rounded p-2">
      {fileStates.length > 0 ? (
        fileStates.map((state, index) => (
          <div
            className="mb-2 flex items-center justify-between rounded border p-2"
            key={index}
          >
            <div className="flex-1">
              <p className="text-muted-foreground truncate text-sm">
                {state.file.name}
              </p>
              <div className="flex items-center gap-2">
                <Progress className="flex-1" value={state.progress} />
                <span className="w-10 text-right text-xs">
                  {state.progress}%
                </span>
                {state.done && !state.error && (
                  <span className="ml-2 text-xs text-green-600">Done</span>
                )}
                {state.error && (
                  <span className="ml-2 text-xs text-red-600">Error</span>
                )}
              </div>
            </div>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              disabled={uploading || !!taskId}
              onClick={() => handleRemoveFile(index)}
              title="Remove"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-sm">No files selected.</p>
      )}
    </div>
  </>
);

interface SelectModeProps {
  filteredDatasets: Dataset[];
  handleClearSelected: (id: string) => void;
  handleSelect: (dataset: Dataset) => void;
  loading: boolean;
  localSelectedDatasets: Dataset[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setView: React.Dispatch<React.SetStateAction<'grid' | 'table'>>;
  view: 'grid' | 'table';
}

const SelectMode = ({
  filteredDatasets,
  handleClearSelected,
  handleSelect,
  loading,
  localSelectedDatasets,
  search,
  setSearch,
  setView,
  view,
}: SelectModeProps) => (
  <div className="bg-muted/50 rounded-xl border">
    <div className="p-2">
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <Input
            className="w-full"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets..."
            value={search}
          />
          <div className="flex-shrink-0">
            <Button
              onClick={() => setView('grid')}
              size="sm"
              type="button"
              variant={view === 'grid' ? 'default' : 'outline'}
            >
              Grid
            </Button>
            <Button
              onClick={() => setView('table')}
              size="sm"
              type="button"
              variant={view === 'table' ? 'default' : 'outline'}
            >
              Table
            </Button>
          </div>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <div className="px-0 py-3">
          {/* DatasetList is a custom component, not a JSX intrinsic element */}
          <DatasetList
            datasets={filteredDatasets}
            loading={loading}
            onSelect={handleSelect}
            selectedDatasets={localSelectedDatasets}
            view={view}
          />
        </div>
      </div>
      <div className="mt-2">
        <div className="flex flex-wrap gap-2">
          {localSelectedDatasets.map((ds) => (
            <span
              className="bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs font-medium"
              key={ds.id}
            >
              {ds.name}
              <button
                aria-label={`Remove selected dataset ${ds.name}`}
                className="text-muted-foreground hover:text-destructive ml-1"
                onClick={() => handleClearSelected(ds.id)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface GetActionButtonProps {
  fileStates: FileUploadState[];
  handleGenerate: (datasetId?: string) => Promise<void>;
  handleUploadMedia: () => Promise<void>;
  loading: boolean;
  localSelectedDatasets: Dataset[];
  mode: 'select' | 'upload';
  setSelectedDataset: React.Dispatch<React.SetStateAction<string>>;
  taskId: null | string | undefined;
  uploading: boolean;
}

const getActionButtonProps = ({
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

export const SyntheticGenerateDialog = ({
  onOpenChange,
  open,
}: SyntheticGenerateDialogProps) => {
  // Mode: 'upload' (drag-and-drop) or 'select' (dataset list)
  const [mode, setMode] = useState<'select' | 'upload'>('upload');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  // For dataset selection mode
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [localSelectedDatasets, setLocalSelectedDatasets] = useState<Dataset[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<null | string | undefined>();
  const [status, setStatus] = useState<null | string | undefined>();
  const [error, setError] = useState<null | string | undefined>();

  // File upload state and handlers (must be inside the component)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [uploading, setUploading] = useState(false);

  // Add files to state and start upload
  const handleFilesSelected = (files: File[] | FileList) => {
    const filesArray = [...files];
    const newFileStates: FileUploadState[] = filesArray.map((file) => ({
      done: false,
      error: false,
      file,
      progress: 0,
    }));
    setFileStates((prev) => [...prev, ...newFileStates]);
  };

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFileStates((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle drag-and-drop file upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  // Upload all files for synthetic media generation
  const handleUploadMedia = async () => {
    if (fileStates.length === 0) {
      return;
    }
    setUploading(true);
    setError(undefined);
    try {
      // Only upload files that are not done or errored
      const filesToUpload = fileStates
        .filter((f) => !f.done && !f.error)
        .map((f) => f.file);
      if (filesToUpload.length === 0) {
        return;
      }
      // No per-file progress from backend, so just set 99% until done
      setFileStates((prev) =>
        prev.map((f) => (!f.done && !f.error ? { ...f, progress: 99 } : f)),
      );
      const res = await uploadMediaForSynthesis(
        filesToUpload,
        selectedDataset || undefined,
      );
      setTaskId(res.task_id);
      setStatus('started');
      setFileStates((prev) =>
        prev.map((f) =>
          !f.done && !f.error ? { ...f, done: true, progress: 100 } : f,
        ),
      );
    } catch (error_) {
      setFileStates((prev) =>
        prev.map((f) => (!f.done && !f.error ? { ...f, error: true } : f)),
      );
      let message = 'Failed to upload media';
      if (error_ instanceof Error) {
        message = error_.message;
      }
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  // Load datasets on open
  React.useEffect(() => {
    if (open) {
      void (async () => {
        const data = await fetchDatasets();
        setDatasets(data);
        setSelectedDataset('');
        setTaskId(undefined);
        setStatus(undefined);
        setError(undefined);
        setLocalSelectedDatasets([]);
        setSearch('');
        setView('grid');
      })();
    }
  }, [open]);

  // Filtered datasets for search
  const filteredDatasets = useMemo(
    () =>
      datasets.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [datasets, search],
  );

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

  const handleClearSelected = (id: string) => {
    setLocalSelectedDatasets(localSelectedDatasets.filter((d) => d.id !== id));
  };

  const handleGenerate = async (datasetId?: string) => {
    const id = datasetId ?? selectedDataset;
    if (!id) {
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const res = await startSyntheticFromDataset(id);
      setTaskId(res.task_id);
      setStatus('started');
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

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        aria-describedby="synthetic-generate-desc"
        className="sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Generate Synthetic Dataset</DialogTitle>
        </DialogHeader>
        <span className="sr-only" id="synthetic-generate-desc">
          Generate a synthetic dataset by uploading media or selecting an
          existing dataset.
        </span>
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              onClick={() => setMode('upload')}
              type="button"
              variant={mode === 'upload' ? 'default' : 'outline'}
            >
              Upload Media
            </Button>
            <Button
              onClick={() => setMode('select')}
              type="button"
              variant={mode === 'select' ? 'default' : 'outline'}
            >
              Select Dataset
            </Button>
          </div>

          {mode === 'upload' ? (
            <UploadMode
              dragActive={dragActive}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              fileStates={fileStates}
              handleChange={handleChange}
              handleDrop={handleDrop}
              handleRemoveFile={handleRemoveFile}
              setDragActive={setDragActive}
              taskId={taskId}
              uploading={uploading}
            />
          ) : (
            <SelectMode
              filteredDatasets={filteredDatasets}
              handleClearSelected={handleClearSelected}
              handleSelect={handleSelect}
              loading={loading}
              localSelectedDatasets={localSelectedDatasets}
              search={search}
              setSearch={setSearch}
              setView={setView}
              view={view}
            />
          )}

          {/* Gemeinsamer Button für beide Modi */}
          <div className="mt-4 flex gap-2">
            {(() => {
              const actionButtonProps = getActionButtonProps({
                fileStates,
                handleGenerate,
                handleUploadMedia,
                loading,
                localSelectedDatasets,
                mode,
                setSelectedDataset,
                taskId,
                uploading,
              });
              return (
                <Button
                  className="flex-1"
                  disabled={actionButtonProps.disabled}
                  onClick={actionButtonProps.onClick}
                  type="button"
                >
                  {actionButtonProps.label}
                </Button>
              );
            })()}
          </div>

          {/* Task status only */}
          {taskId && (
            <div className="space-y-2">
              <div>Status: {status}</div>
            </div>
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
