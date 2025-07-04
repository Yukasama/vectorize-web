'use client';

import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import React from 'react';

/**
 * UploadMode component for synthetic dataset generation.
 * Provides a drag-and-drop area and file input for uploading media or PDF files.
 * Displays a list of selected files with upload progress and error/success status.
 */

export interface FileUploadState {
  done: boolean;
  error: boolean;
  file: File;
  progress: number;
}

interface UploadModeProps {
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileStates: FileUploadState[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLButtonElement>) => void;
  handleRemoveFile: (index: number) => void;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: null | string | undefined;
  uploading: boolean;
}

export const UploadMode = ({
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
  <div className="space-y-4">
    {/* Drag-and-Drop Area for file selection */}
    <button
      aria-label="Upload files by clicking or dragging"
      className={`flex h-44 min-h-[176px] w-full min-w-0 cursor-pointer items-center justify-center rounded border-2 border-dashed transition ${
        dragActive ? 'border-primary bg-muted' : 'border-muted'
      }`}
      disabled={uploading || !!taskId}
      onClick={() => fileInputRef.current.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDragActive(false);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
      }}
      onDrop={handleDrop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current.click();
        }
      }}
      type="button"
    >
      <p className="text-muted-foreground text-sm">
        Drop PDF or media files here or click to select.
      </p>
      <Input
        accept=".pdf,image/*,video/*"
        className="hidden"
        disabled={uploading || !!taskId}
        multiple
        onChange={handleChange}
        ref={fileInputRef}
        type="file"
      />
    </button>

    {/* File List with Progress and status */}
    {fileStates.length > 0 && (
      <div className="bg-muted rounded p-4">
        {fileStates.map((state) => (
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
                {/* Show status for each file */}
                {state.done && !state.error && (
                  <span className="ml-2 text-xs text-green-600">Done</span>
                )}
                {state.error && (
                  <span className="ml-2 text-xs text-red-600">Error</span>
                )}
              </div>
            </div>
            {/* Remove file button for each file */}
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              disabled={uploading || !!taskId}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(
                  fileStates.findIndex(
                    (f) =>
                      f.file.name === state.file.name &&
                      f.file.size === state.file.size,
                  ),
                );
              }}
              title="Remove"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);
