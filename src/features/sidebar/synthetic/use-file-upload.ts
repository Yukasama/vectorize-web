import { useEffect, useState } from 'react';
import { uploadMediaForSynthesis } from '../services/synthetic-service';
import type { FileUploadState } from './upload-mode';

export const useFileUpload = (
  open: boolean,
  onSuccess: () => void,
  setTaskId: (id: string) => void,
  setStatus: (status: string) => void,
  setError: (error: string | undefined) => void,
) => {
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  // Reset file upload state when dialog is closed (React Query pattern)
  useEffect(() => {
    if (!open) {
      setFileStates([]);
      setUploading(false);
      setDragActive(false);
      setUploadError(undefined);
    }
  }, [open]);

  // Add files to state
  const handleFilesSelected = (files: File[] | FileList) => {
    setUploadError(undefined); // Clear previous errors
    const filesArray = [...files];

    // Basic validation for file types (PDF and common media types)
    const validTypes = new Set([
      'application/pdf',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/ogg',
      'video/webm',
    ]);

    const invalidFiles = filesArray.filter(
      (file) => !validTypes.has(file.type),
    );

    if (invalidFiles.length > 0) {
      setUploadError(
        `Unsupported file type(s): ${invalidFiles.map((f) => f.name).join(', ')}. Please upload PDF or media files.`,
      );
      return;
    }

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
    e.stopPropagation();
    setDragActive(false);

    // Validate that files are being dropped
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  // Upload all files for synthetic media generation
  const handleUploadMedia = async (selectedDataset?: string) => {
    if (fileStates.length === 0) {
      return;
    }
    setUploading(true);
    setUploadError(undefined);
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
        selectedDataset ?? undefined,
      );
      setTaskId(res.task_id);
      setStatus('started');
      setFileStates((prev) =>
        prev.map((f) =>
          !f.done && !f.error ? { ...f, done: true, progress: 100 } : f,
        ),
      );
      onSuccess();
    } catch (error_) {
      setFileStates((prev) =>
        prev.map((f) => (!f.done && !f.error ? { ...f, error: true } : f)),
      );
      let message = 'Failed to upload media';
      if (error_ instanceof Error) {
        message = error_.message;
      }
      setUploadError(message);
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return {
    dragActive,
    fileStates,
    handleChange,
    handleDrop,
    handleFilesSelected,
    handleRemoveFile,
    handleUploadMedia,
    setDragActive,
    uploadError,
    uploading,
  };
};
