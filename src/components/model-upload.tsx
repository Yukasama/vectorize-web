'use client';

import { uploadGithub } from '@/components/services/modelUpload/uploadGithub';
import { uploadHuggingFace } from '@/components/services/modelUpload/uploadHuggingFace';
import { uploadLocalFile } from '@/components/services/modelUpload/uploadLocalFile';
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
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';

export const ModelUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Mehrere Dateien
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [huggingFaceModelId, setHuggingFaceModelId] = useState('');
  const [huggingFaceTag, setHuggingFaceTag] = useState('');
  const [localModelName, setLocalModelName] = useState('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = [...e.dataTransfer.files];
    setSelectedFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = [...e.target.files];
      setSelectedFiles(files);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedFiles([]);
    setGithubUrl('');
    setHuggingFaceModelId('');
    setHuggingFaceTag('');
    setLocalModelName('');
  };

  const handleUpload = async () => {
    const optionsSelected = [
      selectedFiles.length > 0 ? 1 : 0,
      githubUrl ? 1 : 0,
      huggingFaceModelId ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    if (optionsSelected !== 1) {
      toast.error(
        'Bitte wählen Sie nur eine Option aus (Dateien, GitHub-URL oder Hugging Face Modell-ID).',
      );
      return;
    }

    if (selectedFiles.length > 0 && !localModelName) {
      toast.error('Bitte geben Sie einen Modellnamen für die Dateien ein.');
      return;
    }

    setUploading(true);

    try {
      if (selectedFiles.length > 0) {
        const data = await uploadLocalFile(selectedFiles, localModelName);
        console.log('Datei-Upload erfolgreich:', data);
        toast.success('Datei-Upload erfolgreich!');
      } else if (githubUrl) {
        const data = await uploadGithub(githubUrl);
        console.log('GitHub-Upload erfolgreich:', data);
        toast.success('GitHub-Upload erfolgreich!');
      } else if (huggingFaceModelId) {
        const data = await uploadHuggingFace(
          huggingFaceModelId,
          huggingFaceTag,
        );
        console.log('Hugging Face-Upload erfolgreich:', data);
        toast.success('Hugging Face-Upload erfolgreich!');
      }
    } catch (error) {
      console.error('Fehler beim Upload:', error);
      toast.error('Fehler beim Upload.');
    } finally {
      setUploading(false);
      handleDialogClose();
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <Dialog
        onOpenChange={(open) =>
          open ? setIsDialogOpen(true) : handleDialogClose()
        }
        open={isDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className="w-full" variant="ghost">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modell Upload</DialogTitle>
          </DialogHeader>

          {/* GitHub Section */}
          <div className="mb-4 flex items-center space-x-4">
            <Image
              alt="GitHub Logo"
              className="h-8 w-8"
              height={32}
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              width={32}
            />
            <Input
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="GitHub-URL eingeben"
              value={githubUrl}
            />
          </div>

          {/* Hugging Face Section */}
          <div className="mb-4 flex items-center space-x-4">
            <Image
              alt="Hugging Face Logo"
              className="h-8 w-8"
              height={32}
              src="https://huggingface.co/front/assets/huggingface_logo.svg"
              width={32}
            />
            <div className="flex-1">
              <Input
                onChange={(e) => setHuggingFaceModelId(e.target.value)}
                placeholder="Modell-ID eingeben"
                value={huggingFaceModelId}
              />
              <Input
                className="mt-2"
                onChange={(e) => setHuggingFaceTag(e.target.value)}
                placeholder="Tag (optional)"
                value={huggingFaceTag}
              />
            </div>
          </div>

          {/* Drag-and-Drop Upload Section */}
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
            {selectedFiles.length > 0 ? (
              <ul className="text-sm">
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                Dateien hier ablegen oder klicken
              </p>
            )}
            <Input
              className="hidden"
              multiple
              onChange={handleChange}
              ref={fileInputRef}
              type="file"
            />
          </div>

          {/* Modellname für lokale Dateien */}
          {selectedFiles.length > 0 && (
            <Input
              className="mt-4"
              onChange={(e) => setLocalModelName(e.target.value)}
              placeholder="Modellname eingeben"
              value={localModelName}
            />
          )}

          <Button
            className="mt-4 w-full"
            disabled={uploading}
            onClick={handleUpload}
          >
            {uploading ? 'Hochladen...' : 'Upload'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
