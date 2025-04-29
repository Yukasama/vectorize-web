'use client';

import { uploadLocalDataset } from '@/components/services/datasetUpload/uploadLocalDataset';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

export const DatasetUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      setFiles((prevFiles) => [...prevFiles, ...e.dataTransfer.files]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFiles([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Bitte wählen Sie mindestens eine Datei aus.');
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        await uploadLocalDataset(file);
      }
      toast.success('Alle Dateien wurden erfolgreich hochgeladen!');
      handleDialogClose();
    } catch (error) {
      toast.error('Fehler beim Hochladen der Dateien.');
      console.error(error);
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
        <div className="text-primary hover:bg-muted flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-transparent px-4 py-2">
          <Upload className="h-4 w-4" /> Upload
        </div>
      </DialogTrigger>
      <DialogContent className="scrollbar-none max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Datensatz Upload</DialogTitle>
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

        {/* File List */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Hochgeladene Dateien</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-40 overflow-y-auto">
              {files.length > 0 ? (
                files.map((file, index) => (
                  <div
                    className="mb-2 flex items-center justify-between rounded border p-2"
                    key={index}
                  >
                    <p className="truncate text-sm">{file.name}</p>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveFile(index)}
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
            </ScrollArea>
          </CardContent>
        </Card>

        <Button
          className="mt-4 w-full"
          disabled={uploading}
          onClick={handleUpload}
        >
          {uploading ? 'Hochladen...' : 'Upload'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
