'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { uploadLocalDataset } from '@/features/sidebar/services/datasetUpload/upload-local-dataset';
import { Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

interface FileUploadState {
  done: boolean;
  error: boolean;
  file: File;
  progress: number;
}

const markFileDone = (
  states: FileUploadState[],
  index: number,
): FileUploadState[] =>
  states.map((state, i) =>
    i === index ? { ...state, done: true, progress: 100 } : state,
  );

const markFileError = (
  states: FileUploadState[],
  index: number,
): FileUploadState[] =>
  states.map((state, i) => (i === index ? { ...state, error: true } : state));

const updateFileProgress = (
  states: FileUploadState[],
  index: number,
  progress: number,
): FileUploadState[] =>
  states.map((state, i) => (i === index ? { ...state, progress } : state));

export const DatasetUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFileStates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFileStates([]);
  };

  const canUpload = (): boolean => {
    if (uploading) {
      return false;
    }
    if (fileStates.length === 0) {
      return false;
    }
    return !fileStates.some((f) => !f.done);
  };

  const getButtonLabel = (): string => {
    if (uploading) {
      return 'Upload...';
    }
    if (fileStates.length > 0 && fileStates.every((f) => f.done)) {
      return 'Save';
    }
    return 'Upload';
  };

  const handleUpload = () => {
    if (fileStates.length === 0) {
      toast.error('Bitte wählen Sie mindestens eine Datei aus.');
      return;
    }
    if (fileStates.some((f) => !f.done)) {
      toast.error('Bitte warten Sie, bis alle Uploads abgeschlossen sind.');
      return;
    }
    toast.success('Alle Dateien wurden erfolgreich hochgeladen!', {
      duration: 4000,
    });
    handleDialogClose();
  };

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
      toast.error(`Fehler beim Hochladen von ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) =>
        open ? setIsDialogOpen(true) : handleDialogClose()
      }
      open={isDialogOpen}
    >
      <DialogTrigger asChild>
        <Button className="h-10 w-10 p-0" variant="ghost">
          <Upload className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="scrollbar-none max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Datensatz Upload</DialogTitle>
          <DialogDescription>
            Bitte wählen Sie die Dateien aus, die Sie hochladen möchten, oder
            ziehen Sie sie in den Bereich unten.
          </DialogDescription>
        </DialogHeader>

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
            Datei hier ablegen oder klicken
          </p>
          <Input
            className="hidden"
            multiple
            onChange={handleChange}
            ref={fileInputRef}
            type="file"
          />
        </div>

        {/* File List mit Fortschritt */}
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
                        Fertig
                      </span>
                    )}
                    {state.error && (
                      <span className="ml-2 text-xs text-red-600">Fehler</span>
                    )}
                  </div>
                </div>
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  disabled={uploading}
                  onClick={() => handleRemoveFile(index)}
                  title="Entfernen"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              Keine Dateien hochgeladen.
            </p>
          )}
        </div>

        <Button
          className="mt-4 w-full"
          disabled={!canUpload()}
          onClick={handleUpload}
        >
          {getButtonLabel()}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
