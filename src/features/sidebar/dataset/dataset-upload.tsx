'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { uploadHFDataset } from '@/features/sidebar/services/datasetUpload/huggingface-upload';
import { messages } from '@/lib/messages';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { uploadLocalDataset } from '../services/datasetUpload/upload-local-dataset';

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

interface DatasetUploadProps {
  onClose?: () => void;
}

export const DatasetUpload = ({ onClose }: DatasetUploadProps) => {
  // File input ref and component state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [uploading, setUploading] = useState(false);

  // Hugging Face upload state
  const [hfId, setHfId] = useState('');
  const [hfTag, setHfTag] = useState('');
  const [hfError, setHfError] = useState<null | string>();

  const queryClient = useQueryClient();

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

  // Reset state
  const resetForm = () => {
    setFileStates([]);
  };

  // Check if upload button should be enabled
  const canUpload = (): boolean => {
    if (uploading) {
      return false;
    }
    // Enable if Hugging Face ID is set (ignore fileStates)
    if (hfId.trim()) {
      return true;
    }
    // Otherwise, require at least one file and all uploads done
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
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hfId.trim()) {
      await handleHuggingFaceUpload();
      return;
    }
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
    resetForm();
    void queryClient.invalidateQueries({ queryKey: ['datasets'] });
    if (onClose) {
      onClose();
    }
  };

  // Hugging Face upload logic
  const handleHuggingFaceUpload = async () => {
    setUploading(true);
    setHfError(undefined);
    try {
      const datasetTag = hfTag.trim()
        ? `${hfId.trim()}:${hfTag.trim()}`
        : hfId.trim();
      await uploadHFDataset(datasetTag);
      toast.success(messages.dataset.upload.success(datasetTag), {
        duration: 4000,
      });
      setHfId('');
      setHfTag('');
      void queryClient.invalidateQueries({ exact: false, queryKey: ['tasks'] });
    } catch (error) {
      setHfError(error instanceof Error ? error.message : String(error));
    } finally {
      setUploading(false);
    }
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
      void queryClient.invalidateQueries({ queryKey: ['datasets'] });
    } catch {
      setFileStates((prev) => markFileError(prev, index));
      toast.error(messages.dataset.upload.errorFile(file.name));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="flex max-h-[520px] min-h-[350px] flex-col overflow-y-auto"
      onSubmit={handleUpload}
    >
      {/* Hugging Face upload section */}
      <div className="mt-2 mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-x-1 gap-y-0">
          <Image
            alt="Hugging Face Logo"
            className="h-8 w-8"
            height={32}
            src="/images/huggingface_logo.svg"
            width={32}
          />
          <Input
            className="w-80 min-w-0"
            disabled={uploading}
            onChange={(e) => setHfId(e.target.value)}
            placeholder={'Enter Hugging Face dataset ID'}
            value={hfId}
          />
          <Input
            className="ml-2 w-20 min-w-0"
            disabled={uploading}
            maxLength={16}
            onChange={(e) => setHfTag(e.target.value)}
            placeholder={'Tag'}
            value={hfTag}
          />
        </div>
        {hfError && (
          <span className="mt-1 text-xs text-red-600">{hfError}</span>
        )}
      </div>
      {/* Drag-and-Drop Area */}
      <button
        aria-label="Upload files by clicking or dragging"
        className={`flex h-44 min-h-[176px] w-full min-w-0 cursor-pointer items-center justify-center rounded border-2 border-dashed transition ${
          dragActive ? 'border-primary bg-muted' : 'border-muted'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        type="button"
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
      </button>

      {/* File List with Progress */}
      <div className="bg-muted mt-4 flex-shrink-0 rounded p-4">
        {fileStates.length > 0 ? (
          fileStates.map((state) => (
            <div
              className="mb-2 flex items-center justify-between rounded border p-2"
              key={`${state.file.name}-${state.file.size}`}
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
                onClick={() =>
                  handleRemoveFile(
                    fileStates.findIndex(
                      (f) =>
                        f.file.name === state.file.name &&
                        f.file.size === state.file.size,
                    ),
                  )
                }
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
      <div className="flex-1" />
      <Button
        className="mt-4 w-full"
        disabled={!canUpload()}
        style={{ marginTop: 'auto' }}
        type="submit"
      >
        {getButtonLabel()}
      </Button>
    </form>
  );
};
