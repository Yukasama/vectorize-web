'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { uploadLocalDataset } from '@/features/sidebar/services/datasetUpload/upload-local-dataset';
import { messages } from '@/lib/messages';
import { Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

/**
 * Dialog and logic for uploading one or more dataset files with progress and removal support.
 */

interface FileUploadState {
  done: boolean;
  error: boolean;
  file: File;
  progress: number;
}

// Mark a file as done (upload complete)
const markFileDone = (
  states: FileUploadState[],
  index: number,
): FileUploadState[] =>
  states.map((state, i) =>
    i === index ? { ...state, done: true, progress: 100 } : state,
  );

// Mark a file as error (upload failed)
const markFileError = (
  states: FileUploadState[],
  index: number,
): FileUploadState[] =>
  states.map((state, i) => (i === index ? { ...state, error: true } : state));

// Update the progress of a file upload
const updateFileProgress = (
  states: FileUploadState[],
  index: number,
  progress: number,
): FileUploadState[] =>
  states.map((state, i) => (i === index ? { ...state, progress } : state));

export const DatasetUpload = () => {
  // File input ref and component state
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
    for (const [idx, file] of filesArray.entries()) {
      const index = fileStates.length + idx;
      void uploadFileWithProgress(file, index);
    }
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

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFileStates((prev) => prev.filter((_, i) => i !== index));
  };

  // Check if upload button should be enabled
  const canUpload = (): boolean => {
    if (uploading) {
      return false;
    }
    if (fileStates.length === 0) {
      return false;
    }
    return !fileStates.some((f) => !f.done);
  };

  // Get label for upload/save button
  const getButtonLabel = (): string => {
    if (uploading) {
      return messages.dataset.upload.uploading;
    }
    if (fileStates.length > 0 && fileStates.every((f) => f.done)) {
      return messages.dataset.upload.save;
    }
    return messages.dataset.upload.upload;
  };

  // Handle upload/save action
  const handleUpload = () => {
    if (fileStates.length === 0) {
      toast.error(messages.dataset.upload.selectFile);
      return;
    }
    if (fileStates.some((f) => !f.done)) {
      toast.error(messages.dataset.upload.waitForUploads);
      return;
    }
    toast.success(messages.dataset.upload.allSuccess, {
      duration: 4000,
    });
    setFileStates([]);
  };

  // Upload a single file and update progress
  const uploadFileWithProgress = async (file: File, index: number) => {
    setUploading(true);
    try {
      await uploadLocalDataset(file, (percent) => {
        setFileStates((prev) =>
          updateFileProgress(prev, index, percent < 100 ? percent : 99),
        );
      });
      setFileStates((prev) => markFileDone(prev, index));
    } catch {
      setFileStates((prev) => markFileError(prev, index));
      toast.error(messages.dataset.upload.errorFile(file.name));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Drag-and-Drop Area */}
      <div
        className={`flex h-32 cursor-pointer items-center justify-center rounded border-2 border-dashed transition ${
          dragActive ? 'border-primary bg-muted' : 'border-muted'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDrop={handleDrop}
      >
        <p className="text-muted-foreground text-sm">
          {messages.dataset.upload.localDropText}
        </p>
        <Input
          className="hidden"
          multiple
          onChange={handleChange}
          ref={fileInputRef}
          type="file"
        />
      </div>

      {/* File List with Progress */}
      <div className="bg-muted mt-4 rounded p-4">
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
                    <span className="ml-2 text-xs text-green-600">
                      {messages.dataset.upload.done}
                    </span>
                  )}
                  {state.error && (
                    <span className="ml-2 text-xs text-red-600">
                      {messages.dataset.upload.error}
                    </span>
                  )}
                </div>
              </div>
              {/* Remove file button */}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                disabled={uploading}
                onClick={() => handleRemoveFile(index)}
                title={messages.dataset.upload.remove}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            {messages.dataset.upload.noFiles}
          </p>
        )}
      </div>

      {/* Upload/Save button */}
      <Button
        className="mt-4 w-full"
        disabled={!canUpload()}
        onClick={handleUpload}
      >
        {getButtonLabel()}
      </Button>
    </div>
  );
};
