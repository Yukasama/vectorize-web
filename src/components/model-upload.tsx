'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

export const ModelUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="ghost">
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modell Upload</DialogTitle>
        </DialogHeader>

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
          {selectedFile ? (
            <p className="text-sm">{selectedFile.name}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Datei hier ablegen oder klicken
            </p>
          )}
          <Input
            className="hidden"
            onChange={handleChange}
            ref={fileInputRef}
            type="file"
          />
        </div>

        <Button className="w-full">Upload</Button>
      </DialogContent>
    </Dialog>
  );
};
