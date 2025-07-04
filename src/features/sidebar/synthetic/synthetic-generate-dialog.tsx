'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import { getActionButtonProps } from './action-button-props';
import { SelectMode } from './select-mode';
import { UploadMode } from './upload-mode';
import { useDatasetSelection } from './use-dataset-selection';
import { useDialogState } from './use-dialog-state';
import { useFileUpload } from './use-file-upload';

interface SyntheticGenerateDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const SyntheticGenerateDialog = ({
  onOpenChange,
  open,
}: SyntheticGenerateDialogProps) => {
  // Use the new dialog state hook to manage dialog visibility and state
  const dialogState = useDialogState({ onOpenChange, open });

  // Custom hooks for file upload and dataset selection logic
  const fileUploadHook = useFileUpload(
    open,
    dialogState.closeDialog,
    dialogState.setTaskId,
    dialogState.setStatus,
    dialogState.setError,
  );

  const datasetSelectionHook = useDatasetSelection(
    open,
    dialogState.closeDialog,
    dialogState.setTaskId,
    dialogState.setStatus,
    dialogState.setError,
  );

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
          {/* Mode Toggle: Switch between upload and select modes */}
          <div className="flex gap-2">
            <Button
              onClick={() => dialogState.setMode('upload')}
              type="button"
              variant={dialogState.mode === 'upload' ? 'default' : 'outline'}
            >
              Upload Media
            </Button>
            <Button
              onClick={() => dialogState.setMode('select')}
              type="button"
              variant={dialogState.mode === 'select' ? 'default' : 'outline'}
            >
              Select Dataset
            </Button>
          </div>

          {/* Render mode-specific UI: UploadMode or SelectMode */}
          {dialogState.mode === 'upload' ? (
            <UploadMode
              dragActive={fileUploadHook.dragActive}
              fileInputRef={
                dialogState.fileInputRef as React.RefObject<HTMLInputElement>
              }
              fileStates={fileUploadHook.fileStates}
              handleChange={fileUploadHook.handleChange}
              handleDrop={fileUploadHook.handleDrop}
              handleRemoveFile={fileUploadHook.handleRemoveFile}
              setDragActive={fileUploadHook.setDragActive}
              taskId={dialogState.taskId}
              uploading={fileUploadHook.uploading}
            />
          ) : (
            <SelectMode
              handleSelect={datasetSelectionHook.handleSelect}
              localSelectedDatasets={datasetSelectionHook.localSelectedDatasets}
              search={dialogState.search}
              setSearch={dialogState.setSearch}
              setView={dialogState.setView}
              view={dialogState.view}
            />
          )}

          {/* Action button for both modes: handles upload or generate actions */}
          <div className="mt-4 flex gap-2">
            {(() => {
              const actionButtonProps = getActionButtonProps({
                fileStates: fileUploadHook.fileStates,
                handleGenerate: datasetSelectionHook.handleGenerate,
                handleUploadMedia: () => fileUploadHook.handleUploadMedia(),
                loading: datasetSelectionHook.loading,
                localSelectedDatasets:
                  datasetSelectionHook.localSelectedDatasets,
                mode: dialogState.mode,
                taskId: dialogState.taskId,
                uploading: fileUploadHook.uploading,
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

          {/* Show task status if available */}
          {dialogState.taskId && (
            <div className="space-y-2">
              <div>Status: {dialogState.status}</div>
            </div>
          )}
          {/* Show error message if present */}
          {dialogState.error && (
            <div className="text-sm text-red-600">{dialogState.error}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
