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
import { Toaster, toast } from 'sonner';

export const ModelUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [huggingFaceModelId, setHuggingFaceModelId] = useState('');
  const [huggingFaceTag, setHuggingFaceTag] = useState('');

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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    setGithubUrl('');
    setHuggingFaceModelId('');
    setHuggingFaceTag('');
  };

  const handleUpload = async () => {
    const optionsSelected = [
      selectedFile ? 1 : 0,
      githubUrl ? 1 : 0,
      huggingFaceModelId ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    if (optionsSelected !== 1) {
      toast.error(
        'Bitte wählen Sie nur eine Option aus (Datei, GitHub-URL oder Hugging Face Modell-ID).',
      );
      return;
    }

    setUploading(true);

    try {
      if (selectedFile) {
        const data = await uploadLocalFile(selectedFile);
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
        open={isDialogOpen}
        onOpenChange={(open) =>
          open ? setIsDialogOpen(true) : handleDialogClose()
        }
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
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="GitHub-URL eingeben"
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
                value={huggingFaceModelId}
                onChange={(e) => setHuggingFaceModelId(e.target.value)}
                placeholder="Modell-ID eingeben"
              />
              <Input
                className="mt-2"
                value={huggingFaceTag}
                onChange={(e) => setHuggingFaceTag(e.target.value)}
                placeholder="Tag (optional)"
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

          <Button
            className="mt-4 w-full"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Hochladen...' : 'Upload'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
